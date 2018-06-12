import IRouteWithConnection from './tools/IRouteWithConnection';
import {Request} from 'express';
import {MyConnection} from 'my-core';

class WoEPlayersRoute implements IRouteWithConnection {
    public path = '/woe/players';

    public async execute(connection: MyConnection, request: Request): Promise<any> {
        const players = await connection.query(`
            select 
                p.id, 
                g.name guildName, g.id guildId, g.icon_url guildIconUrl,
                p.name,
                p.games_played gamesPlayed,
                p.rate,
                p.rate_aux rateAux,
                wa1.id playerSpec1Id,
                wa1.special_name playerSpec1Name,
                wa1.fa_icon playerSpec1Icon,
                wa2.id playerSpec2Id,
                wa2.special_name playerSpec2Name,
                wa2.fa_icon playerSpec2Icon,
                max(wp.woe_id) lastPlayerWoe,
                count(distinct(wp.woe_id)) woes,
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
                left join woe_attribute wa1 on wa1.id = p.rate_woe_attribute_id
                left join woe_attribute wa2 on wa2.id = p.rate_aux_woe_attribute_id
                inner join woe_player wp on p.id = wp.player_id
                inner join woe_player_value wpv on wpv.woe_player_id = wp.id
                and wp.woe_id > (
                    select id
                    from woe
                    order by id desc
                    limit 10, 1
                )               
                inner join woe_player wp_g on p.id = wp_g.player_id and wp_g.game_index = p.games_played
                inner join guild g on g.id = wp_g.guild_id
    
            group by 
                p.id, g.id
            order by 
                p.rate desc, woes desc, p.games_played desc
        `);

        return players;
    }

}

export default WoEPlayersRoute;