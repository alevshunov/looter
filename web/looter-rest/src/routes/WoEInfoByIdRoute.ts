import IRouteWithConnection from './tools/IRouteWithConnection';
import {Request} from 'express';
import {MyConnection} from 'my-core';

class WoEInfoByIdRoute implements IRouteWithConnection {
    public path = '/woe/info/:id';

    public async execute(connection: MyConnection, request: Request): Promise<any> {
        const woeId = request.params.id;

        let woe = await connection.query(`select id, post_id as postId, date, name from woe where id = ?`, woeId);

        if (woe.length === 0) {
            return {};
        }

        woe = woe[0];

        const rate = await connection.query(`
            select a.id, a.ui_name as name, sum(value) sum
            from 
                woe_player wp
                inner join woe_player_value pv on pv.woe_player_id = wp.id
                inner join woe_attribute a on a.id = pv.woe_attribute_id
            where wp.woe_id = ? and a.id not in (3, 4, 10)
            group by a.id
            order by a.sort_order
        `, woe.id);

        const attributes = await connection.query(`select * from woe_attribute order by sort_order`);

        const avgServerValue = await connection.query(`
            select woe_attribute_id attributeId, TRUNCATE(avg(value), 2) avg
            from woe_player_value
            group by woe_attribute_id
        `);

        const players = await connection.query(`
            select
                a.id as attributeId,
                p.id as playerId,
                p.name as playerName,
                wp_rate.rate playerRate,
                wp_rate.rate_delta playerRateDelta,
                wp_rate.rate_index playerRateIndex,
                wp_rate.rate_index_delta playerRateIndexDelta,
                wp_a_rate.rate rate,
                wp_a_rate.rate_delta rateDelta,
                wp_a_rate.rate_index rateIndex,
                wp_rate.main_woe_attribute_id = a.id isMain,
                wp_rate.aux_woe_attribute_id = a.id isAux,
                wa1.id playerSpec1Id,
                wa1.special_name playerSpec1Name,
                wa1.fa_icon playerSpec1Icon,
                wa2.id playerSpec2Id,
                wa2.special_name playerSpec2Name,
                wa2.fa_icon playerSpec2Icon,                
                pv.value as value,
                pv.position_index,
                g.icon_url guildIcon,
                g.id guildId,
                g.name guildName,
                ifnull(wp.game_index, 0) woeNumber,
                ifnull(TRUNCATE(ifnull(sm.v, 0)/(wp.game_index-1), 2), 0) avgPlayerValue,
                TRUNCATE((ifnull(sm.v, 0) + pv.value)/(ifnull(wp.game_index, 0)), 2) avgPlayerValueNew
                
            from
                woe w
                inner join woe_player wp on wp.woe_id = w.id
                inner join woe_player_value pv on pv.woe_player_id = wp.id
                inner join player p on p.id = wp.player_id
                inner join woe_player_rate wp_rate on wp_rate.player_id = p.id and wp_rate.woe_id = w.id
                inner join woe_player_attribute_rate wp_a_rate on wp_a_rate.woe_player_rate_id = wp_rate.id and wp_a_rate.woe_player_value_id = pv.id
                left join woe_attribute wa1 on wa1.id = wp_rate.main_woe_attribute_id
                left join woe_attribute wa2 on wa2.id = wp_rate.aux_woe_attribute_id
                inner join woe_attribute a on a.id = pv.woe_attribute_id
                inner join guild g on g.id = wp.guild_id
                left join (
                    select wp.player_id, pv.woe_attribute_id, sum(value) v
                    from woe_player_value pv inner join woe_player wp on wp.id = pv.woe_player_id
                    where woe_id < ?
                    group by wp.player_id, pv.woe_attribute_id
                ) sm on sm.player_id = p.id and sm.woe_attribute_id = a.id
                
            where 
                w.id = ?
                
            order by
                a.sort_order, pv.value desc, pv.id
        `, woeId, woeId);

        const log = await connection.query(`
            select m.date, m.originalMessage as message
            from woe w inner join woe_log l on l.woe_id = w.id inner join messages m on l.message_id = m.id
            where w.id = ?    
            order by m.date
        `, woeId);

        const castlesLog = await connection.query(`
            select date, c.id castleId, c.name castleName, c.location castleLocation, g.id guildId, g.name guildName, g.icon_url guildIconUrl, p.id playerId, p.name playerName
            from woe_castle wc
            inner join castle c on c.id = wc.castle_id
            inner join player p on p.id = wc.player_id
            inner join guild g on g.id = wc.guild_id
            where woe_id = ?
            order by date
        `, woeId);

        const castleOwnership = await connection.query(`
            select c.id castleId, c.name castleName, c.location castleLocation, g.id guildId, g.name guildName, g.icon_url guildIconUrl
            from woe_castle_ownership o
            inner join guild g on g.id = o.guild_id
            inner join castle c on c.id = o.castle_id
            where o.woe_id = ?
            order by c.sort_order        
        `, woeId);

        const data = {
            woe,
            rate,
            log,
            castlesLog,
            castleOwnership,
            stat: attributes.map(a => {
                return {
                    id: a.id,
                    name: a.name,
                    icon: a.fa_icon,
                    avg: (avgServerValue.find(av => av.attributeId === a.id) || {avg: 0}).avg,
                    players: players.filter(s => s.attributeId === a.id)
                };
            }).filter(s => s.players.length > 0)

        };

        return data;
    }

}

export default WoEInfoByIdRoute;