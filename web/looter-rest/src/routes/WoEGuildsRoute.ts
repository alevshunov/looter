import IRouteWithConnection from './tools/IRouteWithConnection';
import {Request} from 'express';
import {MyConnection} from 'my-core';

class WoEGuildsRoute implements IRouteWithConnection {
    public path = '/woe/guilds';

    public async execute(connection: MyConnection, request: Request): Promise<any> {
        const data = await connection.query(`
            select r.*, (r.kills - r.death) / woes rate
            from
            (
                select 
                g.id, 
                g.name,
                g.icon_url iconUrl, 
                count(distinct(woe_id)) woes,
                sum(CASE WHEN (wpv.woe_attribute_id=1) THEN wpv.value ELSE 0 END) as kills,
                sum(CASE WHEN (wpv.woe_attribute_id=2) THEN wpv.value ELSE 0 END) as damage,
                sum(CASE WHEN (wpv.woe_attribute_id=3) THEN wpv.value ELSE 0 END) as damagegot,
                sum(CASE WHEN (wpv.woe_attribute_id=4) THEN wpv.value ELSE 0 END) as death,
                sum(CASE WHEN (wpv.woe_attribute_id=5) THEN wpv.value ELSE 0 END) as emperium,
                sum(CASE WHEN (wpv.woe_attribute_id=6) THEN wpv.value ELSE 0 END) as barricades,
                sum(CASE WHEN (wpv.woe_attribute_id=7) THEN wpv.value ELSE 0 END) as buffs,
                sum(CASE WHEN (wpv.woe_attribute_id=8) THEN wpv.value ELSE 0 END) as debuffs,
                sum(CASE WHEN (wpv.woe_attribute_id=9) THEN wpv.value ELSE 0 END) as wings
            
                from guild g 
                inner join woe_player wp on g.id = wp.guild_id
                inner join woe_player_value wpv on wp.id = wpv.woe_player_id
                where name is not null and guild_id > 1
                group by guild_id
            ) r
            order by rate desc    
        `);

        return data;
    }

}

export default WoEGuildsRoute;