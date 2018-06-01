import {MyConnection} from "my-core";

class RateAndIndexRecalculator {
    private _connection: MyConnection;

    constructor(connection: MyConnection) {
        this._connection = connection;
    }

    async recalculate() {
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

        await this._connection.query(`
            update player
            set games_played = (select count(distinct(woe_id)) from woe_player where player_id = player.id)
        `);

        await this._connection.query(`
            update woe 
            set rate = (
                select truncate(value_int/1000000,2)
                from woe_value
                where woe_attribute_id = 11 and woe_id = woe.id
            )
        `);


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

        for (let i=0; i<names.length; i++) {
            const parts = /\- Замок \[.+\] захвачен гильдией \[(.+)\]\! Империум разбила? .+\./.exec(names[i].message);
            await this._connection.query(`
                update guild 
                set name = ? 
                where id = ? and name is null
            `,
                parts[1], names[i].guildId);
        }
    }
}

export default RateAndIndexRecalculator;