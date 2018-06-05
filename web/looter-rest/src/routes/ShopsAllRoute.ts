import IRouteWithConnection from './tools/IRouteWithConnection';
import {Request} from 'express';
import {MyConnection} from 'my-core';
import {extractTermDetails} from '../tools/Common';

class ShopsAllRoute implements IRouteWithConnection {
    public path = '/shops/all';

    public async execute(connection: MyConnection, req: Request): Promise<any> {
        const args = extractTermDetails(req.query.term);
        const data = await connection.query(`
            select s.id, s.name, s.location, s.owner, s.date, s.type
            from shops s
            where s.active = 1 and s.fetch_count > 0 
            and (s.name like ? or s.owner like ? or s.location like ?)
            and type like ?
            order by s.date desc
            limit 100
        `,
            args.term, args.term, args.term, args.direction,
        );
        return data;
    }

}

export default ShopsAllRoute;