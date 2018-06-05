import IRouteWithConnection from './tools/IRouteWithConnection';
import {Request} from 'express';
import {MyConnection} from 'my-core';

class ShopsByOwnerRoute implements IRouteWithConnection {
    public path = '/shops/by/:owner';

    public async execute(connection: MyConnection, request: Request): Promise<any> {
        const itemName = request.params.owner;
        const data = await connection.query(`
            select s.id, s.name, s.location, s.owner, s.date, s.last_fetch lastFetch, s.active, s.type
            from shops s
            where s.fetch_count > 0 
            and s.owner = ?
            order by s.date desc
            limit 100
        `,
            itemName,
        );

        return data;
    }

}

export default ShopsByOwnerRoute;