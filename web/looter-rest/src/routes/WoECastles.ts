import IRouteWithConnection from './Tools/IRouteWithConnection';
import {Request} from 'express';
import {MyConnection} from 'my-core';

class WoECastles implements IRouteWithConnection {
    public path = '/woe/castles';

    public async execute(connection: MyConnection, request: Request): Promise<any> {
        const data = await connection.query(`
            select 
                c.id castleId, c.name castleName, c.location castleLocation, w.id woeId, w.name woeName, datediff(now(), w.date) days,
                g.id guildId, g.name guildName, g.icon_url guildIconUrl, 
                p.id playerId, p.name playerName,
                l.date date
            from
            castle c inner join
            (
                select wc.castle_id, max(wc.woe_id) woe_id
                from woe_castle wc
                group by wc.castle_id
            ) t on c.id = t.castle_id
            inner join woe w on t.woe_id = w.id
            inner join woe_castle_ownership o on o.castle_id = c.id and o.woe_id = w.id
            inner join guild g on g.id = o.guild_id
            inner join (
                select *
                from woe_castle
                where id in (
                    select max(id)
                    from woe_castle
                    group by woe_id, castle_id
                )
            ) l on l.woe_id = w.id and l.castle_id = c.id
            inner join player p on p.id = l.player_id
            order by c.sort_order        
        `);

        return data;
    }

}

export default WoECastles;