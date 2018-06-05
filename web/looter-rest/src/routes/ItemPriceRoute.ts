import IRouteWithConnection from './tools/IRouteWithConnection';
import {Request} from 'express';
import {MyConnection} from 'my-core';

class ItemPriceRoute implements IRouteWithConnection {
    public path = '/item/price/:itemName';

    public async execute(connection: MyConnection, request: Request): Promise<any> {
        const itemName = request.params.itemName;
        const days = 31;

        const data = await connection.query(`
        select c.date, isell.min minSell, isell.max maxSell, ibuy.min minBuy, ibuy.max maxBuy
        from 
        (
            select * 
            from calendar 
            where date between date_add(now(), interval -${days} day) and now()
        ) c
        
        left join (
            select si.name, date(si.date) date, min(price) min, max(price) max
            from shop_items si left join shops s on s.id = si.shop_id
            where si.name = ? and s.type = 'sell'
            and si.date between date_add(now(), interval -${days} day) and now()
            group by date(si.date)
        ) isell on c.date = date(isell.date)
        
        left join (
            select si.name, date(si.date) date, min(price) min, max(price) max
            from shop_items si left join shops s on s.id = si.shop_id
            where si.name = ? and s.type = 'buy'
            and si.date between date_add(now(), interval -${days} day) and now()
            group by date(si.date)
            
        ) ibuy on c.date = date(ibuy.date)
        
        order by c.date
        `,
            itemName, itemName
        );
        return data;
    }

}

export default ItemPriceRoute;