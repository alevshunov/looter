import {MyConnection} from "my-core";
import PlayerSaver from '../PlayerSaver';
import PlayerOnWoESaver from '../PlayerOnWoESaver';

class RateAndIndexRecalculator {
    private _connection: MyConnection;

    constructor(connection: MyConnection) {
        this._connection = connection;
    }

    async recalculate() {
        await this.extractPlayerGamesPlayedCount();
        await this.extractGuildGamesPlayedCount();
        await this.extractWoeRate();
        // await this.extractedWoeLog();
        await this.extractGuildNamesFromEmperiumDefeats();
        await this.extractEmperiumDefeats();
        await this.extractCastleOwnerships();
        await this.extractPlayerPositionIndexAndRate();
    }

    private async extractPlayerPositionIndexAndRate() {
        await this._connection.query(`
            update woe_player_value pv
            set pv.position_index = (
                select count(*) + 1
                from 
					(
						select 
							pv.value, wp.woe_id, wp.player_id, pv.woe_attribute_id
                        from 
							woe_player_value pv 
							inner join woe_player wp on wp.id = pv.woe_player_id
					) pv2 
                where 
					pv2.woe_id = (select woe_id from woe_player wp2 where wp2.id = pv.woe_player_id) 
					and pv2.woe_attribute_id = pv.woe_attribute_id and pv2.value > pv.value
            ),
            rate = (
                select 
					pv.value / max(value)
                from (
						select 
							pv.value, wp.woe_id, wp.player_id, pv.woe_attribute_id
                        from 
							woe_player_value pv 
							inner join woe_player wp on wp.id = pv.woe_player_id
                    ) t
                where 
					t.woe_id = (select woe_id from woe_player wp2 where wp2.id = pv.woe_player_id)
                    and pv.woe_attribute_id = t.woe_attribute_id
            )
            where pv.position_index = 0
        `);
    }

    private async extractPlayerGamesPlayedCount() {
        await this._connection.query(`
            update player
            set games_played = (select count(distinct(woe_id)) from woe_player where player_id = player.id)
        `);
    }

    private async extractGuildGamesPlayedCount() {
        await this._connection.query(`
            update guild g
            set games_played = (
                select count(distinct(woe_id))
                from woe_player
                where guild_id = g.id
            )
        `);
    }

    private async extractWoeRate() {
        await this._connection.query(`
            update woe 
            set rate = (
                select truncate(value_int/1000000,2)
                from woe_value
                where woe_attribute_id = 11 and woe_id = woe.id
            )
        `);
    }

    private async extractedWoeLog() {
        await this._connection.query(`
            insert into woe_log(message_id, woe_id)
            select m.id message_id, w.id woe_id
            from messages m inner join woe w on date(m.date) = date(w.date)
            where 
            (
            originalMessage like '- У гильдии [%] новый GuildMaster - %!'
            or originalMessage like '- Война за Империум%началась!!'
            or originalMessage like '- Замок [%] захвачен гильдией [%]! Империум разбил%.'
            or originalMessage like '- Война за Империум%завершена!'
            or originalMessage like '- Замком [%] владеет гильдия [%].'
            )
            and originalOwner = 'FreeRO'
            and w.id not in (select distinct woe_id from (select * from woe_log) t)  
        `);
    }

    private async extractGuildNamesFromEmperiumDefeats() {
        const names = await this._connection.query(`
            select g.id guildId, originalMessage message
            from 
            player p
            inner join woe_player wp on wp.player_id = p.id
            inner join woe w on w.id = wp.woe_id
            inner join guild g on g.id = wp.guild_id
            inner join woe_log l on l.woe_id = w.id
            inner join messages m on m.id = l.message_id
            where (originalMessage like concat('- Замок [%] захвачен гильдией [%]! Империум разбил ', p.name, '.')
            or originalMessage like concat('- Замок [%] захвачен гильдией [%]! Империум разбила ', p.name, '.'))
            and g.name is null
        `);

        for (let i = 0; i < names.length; i++) {
            const parts = /\- Замок \[.+\] захвачен гильдией \[(.+)\]\! Империум разбила? .+\./.exec(names[i].message);
            await this._connection.query(`
                update guild 
                set name = ? 
                where id = ? and name is null
            `,
                parts[1], names[i].guildId);
        }
    }

    private async extractEmperiumDefeats() {
        const lastCastleUpdateDate = await this._connection.query(`select ifnull(max(date), date('2017-01-01')) date from woe_castle`);
        const castleDate = lastCastleUpdateDate[0].date;

        const castlesLog = await this._connection.query(`
            select wl.woe_id woeId, originalMessage message, m.date
            from woe_log wl
            inner join messages m on m.id = wl.message_id
            where originalMessage like '- Замок [%] захвачен гильдией [%]! Империум разби%.'
            and m.date > ?
            order by m.date
        `, castleDate);

        const castles = {};
        (await this._connection.query(`select id, name from castle`)).forEach(c => castles[c.name] = c.id);

        const guilds = {};
        (await this._connection.query(`select id, name from guild where name is not null`)).forEach(g => guilds[g.name] = g.id);

        for (let i = 0; i < castlesLog.length; i++) {
            const take = castlesLog[i];
            const parts = /\- Замок \[(.+?)\] захвачен гильдией \[(.+?)\]\! Империум разбила? (.+?)\./.exec(take.message);
            const castleName = parts[1];
            const guildName = parts[2];
            const playerName = parts[3];

            const woeId = take.woeId;

            const castleId = castles[castleName];
            if (!castleId) {
                throw `Castle ${castleName} not found.`;
            }

            const playerId = await new PlayerSaver(playerName, this._connection).save();

            let guildId = guilds[guildName];
            if (!guildId) {
                const result = await this._connection.query(`
                    select g.*
                    from woe_player wp 
                    inner join guild g on g.id = wp.guild_id 
                    where wp.player_id = ?
                    order by wp.woe_id desc
                    limit 1                
                `, playerId);

                if (result.length === 1 && !result[0].name) {
                    guildId = result[0].id;

                    await this._connection.query(`
                        update guild set name = ? where id = ?
                    `, guildName, guildId);

                    guilds[guildName] = guildId;
                } else {
                    const result = await this._connection.query(`
                        insert into guild(name, icon_url) values(?, ?)
                    `, guildName, '');

                    guildId = result.insertId;
                    guilds[guildName] = guildId;
                }
            }

            let woePlayerId = await this.executeScalar(`
                select wp.id as value
                from woe_player wp
                where wp.player_id = ? and wp.woe_id = ?
            `, playerId, woeId);

            if (!woePlayerId) {
                woePlayerId = await new PlayerOnWoESaver(woeId, playerId, guildId, 13, 1, this._connection).save();
            } else {
                const result = await this._connection.query(`
                    update woe_player_value
                    set value = value + 1 
                    where woe_attribute_id = 13 and woe_player_id = ?
                `, woePlayerId);
                if (result.affectedRows === 0) {
                    await this._connection.query(`
                        insert into woe_player_value(woe_player_id, woe_attribute_id, value)
                        values(?, ?, ?)
                    `, woePlayerId, 13, 1);
                }
            }

            await this._connection.query(`
                insert into woe_castle(woe_id, castle_id, guild_id, player_id, date) values(?,?,?,?,?)
            `, woeId, castleId, guildId, playerId, take.date);

        }
    }

    private async extractCastleOwnerships() {
        const lastWoeId = (await this.executeScalar(`select max(woe_id) value from woe_castle_ownership`)) || 0;

        const owns = await this._connection.query(`
            select wl.woe_id woeId, m.originalMessage message
            from woe_log wl
            inner join messages m on m.id = wl.message_id
            where originalMessage like '- Замком [%] владеет гильдия [%].'
            and woe_id > ?
            order by m.date        
        `, lastWoeId);

        const castles = {};
        (await this._connection.query(`select id, name from castle`)).forEach(c => castles[c.name] = c.id);

        const guilds = {};
        (await this._connection.query(`select id, name from guild where name is not null`)).forEach(g => guilds[g.name] = g.id);

        for (let i=0; i<owns.length; i++) {
            const own = owns[i];
            const woeId = own.woeId;

            const parts = /\- Замком \[(.+?)\] владеет гильдия \[(.+?)\]\./.exec(own.message);

            const castleName = parts[1];
            const castleId = castles[castleName];

            const guildName = parts[2];
            const guildId = guilds[guildName];

            await this._connection.query(`
                insert into woe_castle_ownership(woe_id, guild_id, castle_id) values(?, ?, ?);
            `, woeId, guildId, castleId);
        }


    }

    async executeScalar(query, ...args) {
        const data = await this._connection.query(query, ...args);
        if (!data || !data.length) {
            return undefined;
        }

        if (data.length > 1 || !data[0].hasOwnProperty('value')) {
            throw 'Expected one row with field "value".';
        }

        return data[0].value;
    }
}

export default RateAndIndexRecalculator;