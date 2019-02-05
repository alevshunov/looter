import IRouteWithConnection from './tools/IRouteWithConnection';
import {Request} from 'express';
import {MyConnection} from 'my-core';
import {extractTermDetails} from '../tools/Common';

class ShopsAllRoute implements IRouteWithConnection {
    public path = '/shops/all';

    public async execute(connection: MyConnection, req: Request): Promise<any> {
        const args = extractTermDetails(req.query.term);
        const data = await connection.query(`
            select s.id, s.name, s.location, s.owner, s.date, s.type, group_concat(distinct(i.id) order by si.id separator ',') items
            from (
                   select s.*
                   from
                      shops s
                      inner join shop_items si on si.shop_id = s.id and si.fetch_index = s.fetch_count
                   where s.active = 1 and s.fetch_count > 0
                   and (s.name like ? or s.owner like ? or s.location like ? or si.name like ? or si.id like ?)
                   and s.type like ?
                 ) s
              inner join shop_items si on si.shop_id = s.id and si.fetch_index = s.fetch_count
              left join item_db_2 i on i.name = si.name
              group by s.id
            order by s.date desc
            limit 100
        `,
            args.term, args.term, args.term, args.term, args.term, args.direction,
        );
        return data;
    }

}

export default ShopsAllRoute;