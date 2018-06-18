import IRouteWithConnection from './tools/IRouteWithConnection';
import {Request} from 'express';
import {MyConnection} from 'my-core';

class WoEPlayerByNameRoute implements IRouteWithConnection {
    public path = '/woe/player/:name';

    public async execute(connection: MyConnection, request: Request): Promise<any> {
        const playerName = request.params.name;

        let player = await connection.query(`
            select 
                p.id, 
                p.name, 
                p.games_played gamesPlayed, 
                pr.rate rate,
                pr.rate_delta rateDelta,
                pr.rate_index rateIndex,
                pr.active,
                wa1.id mainAttributeId,
                wa1.special_name mainAttributeName,
                wa1.fa_icon mainAttributeIcon,
                ar1.rate mainRate, 
                ar1.rate_delta mainRateDelta, 
                ar1.rate_index mainRateIndex,
                wa2.id auxAttributeId,
                wa2.special_name auxAttributeName,
                wa2.fa_icon auxAttributeIcon,
                ar2.rate auxRate, 
                ar2.rate_delta auxRateDelta, 
                ar2.rate_index auxRateIndex
                
            from player p
            left join woe_player wp on wp.player_id = p.id and wp.woe_id = (select max(id) from woe)
            left join woe_player_rate pr on pr.player_id = p.id
            
            left join woe_attribute wa1 on wa1.id = pr.main_woe_attribute_id
            left join woe_attribute wa2 on wa2.id = pr.aux_woe_attribute_id
            left join woe_player_attribute_rate ar1 on ar1.woe_player_rate_id = pr.id and ar1.woe_attribute_id = wa1.id
            left join woe_player_attribute_rate ar2 on ar2.woe_player_rate_id = pr.id and ar2.woe_attribute_id = wa2.id
            
            where p.name = ?
            and pr.woe_id = (select max(id) from woe)
        `, playerName);

        if (player.length === 0) {
            return {};
        }

        player = player[0];

        const guilds = await connection.query(`
        select g.id, g.name, g.icon_url iconUrl
        from player p
        inner join woe_player wp on wp.player_id = p.id
        inner join guild g on g.id = wp.guild_id
        where p.id = ?
        order by woe_id desc
        limit 1
    `, player.id);

        let guild;

        if (guilds.length) {
            guild = guilds[0];
        }

        const rate = await connection.query(`
        select wp.player_id, a.id, a.ui_name as name, max(value) max, sum(value) sum, sum(value) / p.games_played avg
        from 
            woe_player wp
            inner join player p on p.id = wp.player_id
            inner join woe_player_value pv on pv.woe_player_id = wp.id 
            inner join woe_attribute a on pv.woe_attribute_id = a.id
        where wp.player_id = ?
        group by pv.woe_attribute_id
        order by wp.player_id, a.sort_order
    `, player.id);

        const woe = await connection.query(`
        select 
            w.*,
            
            g.icon_url guildIconUrl,
            g.name guildName,
            g.id guildId,
		
            (select ifnull(sum(pv.value), 0) from woe_player_value pv inner join woe_player wp on pv.woe_player_id = wp.id where wp.woe_id = w.id and pv.woe_attribute_id = 1 and wp.player_id = wp_b.player_id) pk,
            (select ifnull(sum(pv.value), 0) from woe_player_value pv inner join woe_player wp on pv.woe_player_id = wp.id where wp.woe_id = w.id and pv.woe_attribute_id = 2 and wp.player_id = wp_b.player_id) pdmg,
            (select ifnull(sum(pv.value), 0) from woe_player_value pv inner join woe_player wp on pv.woe_player_id = wp.id where wp.woe_id = w.id and pv.woe_attribute_id = 3 and wp.player_id = wp_b.player_id) pdmgget,
            (select ifnull(sum(pv.value), 0) from woe_player_value pv inner join woe_player wp on pv.woe_player_id = wp.id where wp.woe_id = w.id and pv.woe_attribute_id = 4 and wp.player_id = wp_b.player_id) pd,
            (select ifnull(sum(pv.value), 0) from woe_player_value pv inner join woe_player wp on pv.woe_player_id = wp.id where wp.woe_id = w.id and pv.woe_attribute_id = 7 and wp.player_id = wp_b.player_id) ps,
            (select ifnull(sum(pv.value), 0) from woe_player_value pv inner join woe_player wp on pv.woe_player_id = wp.id where wp.woe_id = w.id and pv.woe_attribute_id = 8 and wp.player_id = wp_b.player_id) pdb,
            (select ifnull(sum(pv.value), 0) from woe_player_value pv inner join woe_player wp on pv.woe_player_id = wp.id where wp.woe_id = w.id and pv.woe_attribute_id = 9 and wp.player_id = wp_b.player_id) pw
			
            
        from 
			woe_player wp_b
			inner join woe w on wp_b.woe_id = w.id
            inner join guild g on g.id = wp_b.guild_id
            
        where wp_b.player_id = ?
        order by w.date desc
    `, player.id);

        const rates = await connection.query(`
            select     
                woe.id woeId,
                woe.name woeName,
                w_p_rate.active,
                
                g.id guildId,
                g.name guildName,
                g.icon_url guildIconUrl,    
                
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
                w_p_a_aux_rate.rate_index auxRateIndex
                
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
                    
                left join woe_player w_player on w_player.player_id = p.id and w_player.woe_id = woe.id
                left join guild g on g.id = w_player.guild_id
                
            where 
                p.id = ?
            
            order by 
                woe.id desc


        `, player.id);

        const data = {
            guild,
            player,
            rate,
            woe,
            rates
        };
        return data;
    }

}

export default WoEPlayerByNameRoute;