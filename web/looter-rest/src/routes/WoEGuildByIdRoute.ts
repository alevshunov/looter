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
                order by a.sort_order
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
                p.id,
                p.name, 
                p.games_played gamesPlayed,
                
                woe.id woeId,
                woe.name woeName,
                w_p_rate.active,
                
                t.lastWoeId,
                
                w_p_rate.rate playerRate,
                w_p_rate.rate_delta playerRateDelta,
                w_p_rate.rate_index playerRateIndex,
                
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
                left join woe_attribute main_a on main_a.id = w_p_rate.main_woe_attribute_id
                left join woe_attribute aux_a on aux_a.id = w_p_rate.aux_woe_attribute_id
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
                        sum(CASE WHEN (pv.woe_attribute_id=2) THEN pv.value ELSE 0 END) as damage,
                        sum(CASE WHEN (pv.woe_attribute_id=3) THEN pv.value ELSE 0 END) as gamagegot,
                        sum(CASE WHEN (pv.woe_attribute_id=4) THEN pv.value ELSE 0 END) as death,
                        sum(CASE WHEN (pv.woe_attribute_id=5) THEN pv.value ELSE 0 END) as emperium,
                        sum(CASE WHEN (pv.woe_attribute_id=6) THEN pv.value ELSE 0 END) as barricades,
                        sum(CASE WHEN (pv.woe_attribute_id=7) THEN pv.value ELSE 0 END) as buffs,
                        sum(CASE WHEN (pv.woe_attribute_id=8) THEN pv.value ELSE 0 END) as debuffs,
                        sum(CASE WHEN (pv.woe_attribute_id=9) THEN pv.value ELSE 0 END) as wings
            
                    from 
                        woe_player_value pv
                        inner join woe_player wp on pv.woe_player_id = wp.id
                        inner join woe_attribute a on a.id = pv.woe_attribute_id
                        
                    -- where pv.woe_attribute_id in (1, 7, 8)
            
                    group by
                        wp.player_id    
                
                ) t on t.player_id = p.id
                
            where 
                woe.id = (select max(id) from woe)

				and
				p.id in (
                    select p.id
                    from player p inner join woe_player wp on p.id = wp.player_id and wp.game_index = p.games_played
                    where wp.guild_id = ?
                )
				and (
                t.lastWoeId > (
                    select woe_id 
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
				)
                
            order by 
                w_p_rate.rate desc
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