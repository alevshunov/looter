import IRouteWithConnection from './tools/IRouteWithConnection';
import {MyConnection} from 'my-core';
import {Request} from 'express';
import {extractTermDetails} from '../tools/Common';

class DealsRoute implements IRouteWithConnection {
    public path: string = '/shops/deals';

    public async execute(connection: MyConnection, req: Request): Promise<any> {
        const termDetails = extractTermDetails(req.query.term);

        const data = await connection.query(`
            select
                deal.shop_id shopId,
                deal.date_from dateFrom,
                deal.date_to dateTo,
                deal.name itemName,
                deal.price,
                deal.sold_count count,
                shop.id shopId,
                shop.name shopName,
                shop.owner shopOwner,
                shop.type,
                i.ids
                                
            from 
                deal
                inner join shops shop on shop.id = deal.shop_id
                left join (
                            select name_japanese, group_concat(distinct id order by id separator ', ') ids 
                            from item_db
                            group by name_japanese
                        ) i on i.name_japanese = deal.name
            
            where 
                shop.type like ?
                and (deal.name like ? or i.ids like ? or shop.owner like ? or shop.owner like ?)
                ${req.query.term ? '' : 'and deal.date_to > (select date_add(max(date_to), interval -1 day) from deal)'}

            order by deal.date_to desc
            
            ${req.query.term ? 'limit 100' : ''}
        `,
            termDetails.direction, termDetails.term, termDetails.term, termDetails.term, termDetails.term

        );

        return data;
    }

}

export default DealsRoute;