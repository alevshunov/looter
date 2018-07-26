import IRouteWithConnection from './tools/IRouteWithConnection';
import {Request} from 'express';
import {MyConnection} from 'my-core';
import {adoptTermToLike} from '../tools/Common';

class WoEPlayersRoute implements IRouteWithConnection {
    public path = '/woe/players';

    public async execute(connection: MyConnection, request: Request): Promise<any> {
        const term = adoptTermToLike(request.query.term);

        const players = await connection.query(`
            select     
                p.id,
                p.name, 
                
                woe.id woeId,
                woe.name woeName,
                w_p_rate.active,
                
                g.id guildId,
                g.name guildName,
                g.icon_url guildIconUrl,    
                
                w_p_rate.rate playerRate,
                w_p_rate.rate_delta playerRateDelta,
                w_p_rate.rate_index playerRateIndex,
                w_p_rate.rate_index_delta playerRateIndexDelta,
                
                main_a.id mainId,
                main_a.special_name mainName,
                main_a.fa_icon mainIcon,
                w_p_a_main_rate.rate mainRate,
                w_p_a_main_rate.rate_delta mainRateDelta,
                w_p_a_main_rate.rate_index mainRateIndex,
            
                aux_a.id auxId,
                aux_a.special_name auxName,
                aux_a.fa_icon auxIcon,
                w_p_a_aux_rate.rate auxRate,
                w_p_a_aux_rate.rate_delta auxRateDelta,
                w_p_a_aux_rate.rate_index auxRateIndex,
                t.woes,
                t.kills,
                t.buffs,
                t.debuffs
                
            from
                player p
                inner join woe_player_rate w_p_rate on p.id = w_p_rate.player_id
                inner join woe on woe.id = w_p_rate.woe_id
                inner join woe_attribute main_a on main_a.id = w_p_rate.main_woe_attribute_id
                inner join woe_attribute aux_a on aux_a.id = w_p_rate.aux_woe_attribute_id
                left join woe_player_attribute_rate w_p_a_main_rate 
                    on w_p_a_main_rate.woe_player_rate_id = w_p_rate.id 
                    and w_p_a_main_rate.woe_attribute_id = w_p_rate.main_woe_attribute_id
                    
                left join woe_player_attribute_rate w_p_a_aux_rate 
                    on w_p_a_aux_rate.woe_player_rate_id = w_p_rate.id 
                    and w_p_a_aux_rate.woe_attribute_id = w_p_rate.aux_woe_attribute_id
                    
                
                left join (
                
                    select 
                        wp.player_id,
                        count(distinct(wp.woe_id)) woes,
                        max(wp.woe_id) lastWoeId,
                        sum(CASE WHEN (pv.woe_attribute_id=1) THEN pv.value ELSE 0 END) as kills,
                        -- sum(CASE WHEN (pv.woe_attribute_id=2) THEN pv.value ELSE 0 END) as damage,
                        -- sum(CASE WHEN (pv.woe_attribute_id=3) THEN pv.value ELSE 0 END) as gamagegot,
                        -- sum(CASE WHEN (pv.woe_attribute_id=4) THEN pv.value ELSE 0 END) as death,
                        -- sum(CASE WHEN (pv.woe_attribute_id=5) THEN pv.value ELSE 0 END) as emperium,
                        -- sum(CASE WHEN (pv.woe_attribute_id=6) THEN pv.value ELSE 0 END) as barricades,
                        sum(CASE WHEN (pv.woe_attribute_id=7) THEN pv.value ELSE 0 END) as buffs,
                        sum(CASE WHEN (pv.woe_attribute_id=8) THEN pv.value ELSE 0 END) as debuffs
                        -- sum(CASE WHEN (pv.woe_attribute_id=9) THEN pv.value ELSE 0 END) as wings
            
                    from 
                        woe_player_value pv
                        inner join woe_player wp on pv.woe_player_id = wp.id
                        inner join woe_attribute a on a.id = pv.woe_attribute_id
                        
                    -- where pv.woe_attribute_id in (1, 7, 8)
            
                    group by
                        wp.player_id    
                
                ) t on t.player_id = p.id
                
                left join woe_player w_player on w_player.player_id = p.id and w_player.woe_id = t.lastWoeId
                left join guild g on g.id = w_player.guild_id 

            where 
                woe.id = (select max(id) from woe)
                and (p.name like ? or g.name like ?)
                
            order by 
                w_p_rate.rate desc
            
            limit 100

        `, term, term);

        return players;
    }

}

export default WoEPlayersRoute;