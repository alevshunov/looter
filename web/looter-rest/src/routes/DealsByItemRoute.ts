import IRouteWithConnection from './tools/IRouteWithConnection';
import {MyConnection} from 'my-core';
import {Request} from 'express';
import {extractTermDetails} from '../tools/Common';

class DealsByItemRoute implements IRouteWithConnection {
    public path: string = '/item/:itemName/deals';

    public async execute(connection: MyConnection, req: Request): Promise<any> {
        const itemName = req.params.itemName;

        const dalsQuery = `
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
                and deal.name like ?

            order by deal.date_to desc
        `;

        const sold = await connection.query(dalsQuery, 'sell', itemName);
        const bought = await connection.query(dalsQuery, 'buy', itemName);

        const avgPriceQuery = `select
                date(deal.date_to) date,
                group_concat(concat(price, 'x', sold_count) separator ', ') deals,
                min(price) minPrice,
                max(price) maxPrice,
                sum(deal.sold_count) soldCount,
                round(sum(price*sold_count)/sum(sold_count)) dayPrice
                                                
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
                and deal.name like ?

			group by date(deal.date_to)
			order by date desc`;

        const soldPrice = await connection.query(avgPriceQuery, 'sell', itemName);
        const boughtPrice = await connection.query(avgPriceQuery, 'buy', itemName);

        return {
            sold,
            bought,
            soldPrice,
            boughtPrice
        };
    }

}

export default DealsByItemRoute;