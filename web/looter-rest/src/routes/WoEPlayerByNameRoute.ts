import IRouteWithConnection from './tools/IRouteWithConnection';
import {Request} from 'express';
import {MyConnection} from 'my-core';

class WoEPlayerByNameRoute implements IRouteWithConnection {
    public path = '/woe/player/:name';

    public async execute(connection: MyConnection, request: Request): Promise<any> {
        const playerName = request.params.name;

        let player = await connection.query(`
        select p.*, 
            p.rate,
            p.rate_aux rateAux,
            wa1.id playerSpec1Id,
            wa1.special_name playerSpec1Name,
            wa1.fa_icon playerSpec1Icon,
            wa2.id playerSpec2Id,
            wa2.special_name playerSpec2Name,
            wa2.fa_icon playerSpec2Icon
        from player p
        left join woe_attribute wa1 on wa1.id = p.rate_woe_attribute_id
        left join woe_attribute wa2 on wa2.id = p.rate_aux_woe_attribute_id
 
        where p.name = ?`, playerName);

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

        const data = {
            guild,
            player,
            rate,
            woe
        };
        return data;
    }

}

export default WoEPlayerByNameRoute;