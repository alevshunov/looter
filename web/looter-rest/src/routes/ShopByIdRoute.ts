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