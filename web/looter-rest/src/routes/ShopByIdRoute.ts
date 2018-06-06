import IRouteWithConnection from './tools/IRouteWithConnection';
import {Request} from 'express';
import {MyConnection} from 'my-core';

class ShopByIdRoute implements IRouteWithConnection {
    public path = '/shop/:id';

    public async execute(connection: MyConnection, request: Request): Promise<any> {
        const id = request.params.id;
        let shop = null;

        let data = await connection.query(`
                select s.id, s.name, s.location, s.owner, s.date, s.last_fetch lastFetch, s.active, s.type
                from shops s
                where s.id = ?
            `,
            id);

        if (data.length > 0) {
            shop = data[0];

            shop.soldHistory = await connection.query(`
                select s1.name, s1.price, s1.date intervalStart, s3.date intervalEnd, (s1.count - ifnull(s2.count, 0)) count
                from
                (
                    select si.fetch_index, si.name, si.price, sum(si.count) count, max(si.date) date
                    from shop_items si inner join shops s on s.id = si.shop_id
                    where si.shop_id = ? and si.fetch_index < s.fetch_count
                    group by si.fetch_index, si.name, si.price
                ) s1
                left join
                (
                    select si.fetch_index, si.name, si.price, sum(si.count) count, max(si.date) date
                    from shop_items si
                    where si.shop_id = ?
                    group by si.fetch_index, si.name, si.price
                ) s2 on s1.name = s2.name and s1.price = s2.price and s1.fetch_index + 1 = s2.fetch_index 
                left join 
                (
                    select fetch_index, max(date) date
                    from shop_items
                    where shop_id = ?
                    group by fetch_index
                ) s3 on s3.fetch_index = s1.fetch_index + 1
                where s1.count != s2.count or s2.count is null
                order by s1.date asc, s1.name            
            `, shop.id, shop.id, shop.id);

            const dataStart = await connection.query(`
                select si.id, si.name, si.price, si.count, group_concat(distinct i.id order by i.id separator ', ') ids
                from shops s inner join shop_items si on s.id = si.shop_id and 1 = si.fetch_index
                left join item_db i on i.name_japanese = si.name
                where s.id = ?
                group by si.id
                order by si.id -- si.name, si.price, si.id
            `,
                id);

            const dataCurrent = await connection.query(`
                select si.id, si.name, si.price, si.count, group_concat(distinct i.id order by i.id separator ', ') ids
                from shops s inner join shop_items si on s.id = si.shop_id and s.fetch_count = si.fetch_index
                left join item_db i on i.name_japanese = si.name
                where s.id = ?
                group by si.id
                order by si.id -- si.name, si.price, si.id
            `,
                id);

            let i=0, j=0;

            while (i<dataStart.length) {
                if (dataCurrent[j] && dataStart[i].name === dataCurrent[j].name && dataStart[i].price === dataCurrent[j].price) {
                    dataStart[i].count = { start: dataStart[i].count, end: dataCurrent[j].count };
                    i++;
                    j++;
                } else {
                    dataStart[i].count = { start: dataStart[i].count, end: 0 };
                    i++;
                }
            }

            shop.items = dataStart;
        }

        return shop;
    }

}

export default ShopByIdRoute;