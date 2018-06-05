import IRouteWithConnection from './tools/IRouteWithConnection';
import {MyConnection} from 'my-core';
import {Request} from 'express';
import {extractTermDetails} from '../tools/Common';

class ShopsActiveRoute implements IRouteWithConnection {
    public path: string = '/shops/active';

    public async execute(connection: MyConnection, req: Request): Promise<any> {
        const termDetails = extractTermDetails(req.query.term);

        const requestedOrder = { field: req.query.order || 'default', direction: req.query.direction || 'asc' };

        if (['default', 'name', 'count', 'price'].indexOf(requestedOrder.field) === -1) {
            requestedOrder.field = 'default';
        }

        if (['asc', 'desc'].indexOf(requestedOrder.direction) === -1) {
            requestedOrder.direction = 'asc';
        }

        const orderMap = {
            'default': req.query.term ? 'si.name asc' : 'max(si.date) desc',
            'name': 'si.name ' + requestedOrder.direction,
            'count': 'count ' + requestedOrder.direction,
            'price' : requestedOrder.direction === 'asc' ? 'min asc' : 'max desc'
        };

        // const order = req.query.term ? 'si.name asc' : 'max(si.date) desc';
        const limit = req.query.term === '*'
            ? ''
            : (
                req.query.term
                && req.query.term.length > 3
                && req.query.term.indexOf('*') === -1
                && req.query.term.indexOf('%') === -1
                    ? ''
                    : 'limit 100'
            );

        const data = await connection.query(`
            select si.name, sum(si.count) as count, min(si.price) as min, max(si.price) as max, s.type, i.ids
            from shops s inner join shop_items si on si.shop_id = s.id
            left join (
                select name_japanese, group_concat(distinct id order by id separator ', ') ids 
                from item_db
                group by name_japanese
            ) i
            on i.name_japanese = si.name
            where 
                s.active = 1
                and s.fetch_count > 0 
                and si.fetch_index = s.fetch_count 
                and (si.name like ? or i.ids like ?)
                and s.type like ?
            group by 
                si.name, s.type
            having
				min(si.price) >= ? and min(si.price) <= ?
            order by ${orderMap[requestedOrder.field]}
                ${limit}
        `,
            termDetails.term, termDetails.term, termDetails.direction, termDetails.minPrice, termDetails.maxPrice
        );

        return data;
    }

}

export default ShopsActiveRoute;