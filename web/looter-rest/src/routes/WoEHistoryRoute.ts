import IRouteWithConnection from './tools/IRouteWithConnection';
import {Request} from 'express';
import {MyConnection} from 'my-core';

class WoEHistoryRoute implements IRouteWithConnection {
    public path = '/woe/history';

    public async execute(connection: MyConnection, request: Request): Promise<any> {
        const data = await connection.query(`
        select 
            w.*,
            (select sum(value) from woe_player_value pv inner join woe_player wp on pv.woe_player_id = wp.id where woe_id = w.id and woe_attribute_id = 1) pk,
            (select sum(value) from woe_player_value pv inner join woe_player wp on pv.woe_player_id = wp.id where woe_id = w.id and woe_attribute_id = 2) pdmg,
            (select sum(value) from woe_player_value pv inner join woe_player wp on pv.woe_player_id = wp.id where woe_id = w.id and woe_attribute_id = 7) ps,
            (select sum(value) from woe_player_value pv inner join woe_player wp on pv.woe_player_id = wp.id where woe_id = w.id and woe_attribute_id = 8) pdb,
            (select sum(value) from woe_player_value pv inner join woe_player wp on pv.woe_player_id = wp.id where woe_id = w.id and woe_attribute_id = 9) pw
        from 
            woe w 
        
        order by w.date desc
        
        limit 50
        `,
        );

        return data;
    }

}

export default WoEHistoryRoute;