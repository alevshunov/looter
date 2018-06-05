import IRouteWithConnection from './tools/IRouteWithConnection';
import {Request} from 'express';
import {MyConnection} from 'my-core';

class WoEGuildByIdRoute implements IRouteWithConnection {
    public path = '/woe/guild/:id';

    public async execute(connection: MyConnection, request: Request): Promise<any> {
        const guildId = request.params.id;

        const guilds = await connection.query(`
        select * from guild where id = ?
    `, guildId);

        if (!guilds.length) {
            return {};
        }

        const guild = guilds[0];

        const rate = await connection.query(`
                select 
                    a.id, a.ui_name as name, max(value) max, sum(value) sum, sum(value) / g.games_played avg
                from 
                    woe_player wp
                    inner join guild g on g.id = wp.guild_id
                    inner join woe_player_value pv on pv.woe_player_id = wp.id 
                    inner join woe_attribute a on pv.woe_attribute_id = a.id
                where wp.guild_id = ?
                group by a.id
        `, guildId);

        const woes = await connection.query(`
                select 
                    w.id, 
                    w.date,
                    w.name,
                    count(distinct(woe_id)) woes,
                    sum(CASE WHEN (wpv.woe_attribute_id=1) THEN wpv.value ELSE 0 END) as kills,
                    sum(CASE WHEN (wpv.woe_attribute_id=2) THEN wpv.value ELSE 0 END) as damage,
                    sum(CASE WHEN (wpv.woe_attribute_id=3) THEN wpv.value ELSE 0 END) as gamagegot,
                    sum(CASE WHEN (wpv.woe_attribute_id=4) THEN wpv.value ELSE 0 END) as death,
                    sum(CASE WHEN (wpv.woe_attribute_id=5) THEN wpv.value ELSE 0 END) as emperium,
                    sum(CASE WHEN (wpv.woe_attribute_id=6) THEN wpv.value ELSE 0 END) as barricades,
                    sum(CASE WHEN (wpv.woe_attribute_id=7) THEN wpv.value ELSE 0 END) as buffs,
                    sum(CASE WHEN (wpv.woe_attribute_id=8) THEN wpv.value ELSE 0 END) as debuffs,
                    sum(CASE WHEN (wpv.woe_attribute_id=9) THEN wpv.value ELSE 0 END) as wings
            
                from 
                    guild g 
                    inner join woe_player wp on g.id = wp.guild_id
                    inner join woe_player_value wpv on wp.id = wpv.woe_player_id
                    inner join woe w on w.id = wp.woe_id
                where g.id = ?
                -- where name is not null
                group by w.id desc  
        `, guildId);

        const players = await connection.query(`
            select 
                p.id, p.name,
                p.games_played gamesPlayed,
                max(wp.woe_id) lastPlayerWoe,
                sum(CASE WHEN (wpv.woe_attribute_id=1) THEN wpv.value ELSE 0 END) as kills,
                sum(CASE WHEN (wpv.woe_attribute_id=2) THEN wpv.value ELSE 0 END) as damage,
                sum(CASE WHEN (wpv.woe_attribute_id=3) THEN wpv.value ELSE 0 END) as gamagegot,
                sum(CASE WHEN (wpv.woe_attribute_id=4) THEN wpv.value ELSE 0 END) as death,
                sum(CASE WHEN (wpv.woe_attribute_id=5) THEN wpv.value ELSE 0 END) as emperium,
                sum(CASE WHEN (wpv.woe_attribute_id=6) THEN wpv.value ELSE 0 END) as barricades,
                sum(CASE WHEN (wpv.woe_attribute_id=7) THEN wpv.value ELSE 0 END) as buffs,
                sum(CASE WHEN (wpv.woe_attribute_id=8) THEN wpv.value ELSE 0 END) as debuffs,
                sum(CASE WHEN (wpv.woe_attribute_id=9) THEN wpv.value ELSE 0 END) as wings
            from 
                player p
                inner join woe_player wp on p.id = wp.player_id
                inner join woe_player_value wpv on wpv.woe_player_id = wp.id
            where 
                p.id in (
                    select p.id
                    from player p inner join woe_player wp on p.id = wp.player_id and wp.game_index = p.games_played
                    where wp.guild_id = ?
                )
            group by 
                p.id
            having
                max(wp.woe_id) > (
                    select * 
                    from
                    (
                        select distinct(woe_id) woe_id
                        from woe_player wp2 
                        where wp2.guild_id = ?
                        order by woe_id desc
                        limit 10
                    ) tt 
                    order by tt.woe_id asc
                    limit 1
                )
            order by 
                p.games_played desc
        `, guildId, guildId);


        const data = {
            rate,
            guild,
            woes,
            players
        };

        return data;
    }

}

export default WoEGuildByIdRoute;