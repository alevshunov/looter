import IRouteWithConnection from './tools/IRouteWithConnection';
import {Request} from 'express';
import {MyConnection} from 'my-core';

class ShopsWithRoute implements IRouteWithConnection {
    public path = '/shops/with/:itemName';

    public async execute(connection: MyConnection, request: Request): Promise<any> {
        const itemName = request.params.itemName;

        let item;

        const ids = await connection.query(`select id from item_db where name_japanese = ?`, itemName);
        if (ids.length > 0) {
            item = ids[0];
        } else {
            item = {}
        }

        const shops = await connection.query(
            `
                select s.id, s.owner, s.location, s.name, min(si.price) min, max(si.price) max, sum(si.count) count, s.type
                from shop_items si 
                inner join shops s on s.id = si.shop_id and si.fetch_index = s.fetch_count
                where si.name = ? and s.active = 1 and s.fetch_count > 0 
                group by s.id
                order by min asc
                limit 100
            `,
            itemName
        );

        return {
            item,
            shops
        };
    }

}

export default ShopsWithRoute;