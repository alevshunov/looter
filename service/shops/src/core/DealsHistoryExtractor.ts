import {MyConnection} from 'my-core';

class DealsHistoryExtractor {
    private _connection: MyConnection;

    constructor(connection: MyConnection) {
        this._connection = connection;
    }

    async extract() {
        await this._connection.query(`
            insert into shop_items_2
            select * from shop_items
            where id > (select ifnull(max(id), 0) from shop_items_2)
        `);

        await this._connection.query(`
            insert into shops_2
            select * from shops
            where id > (select ifnull(max(id), 0) from shops_2)
        `);

        await this._connection.query(`
            insert into shop_items_aggr(shop_id, fetch_index, name, price, date, count)
            select si.shop_id, si.fetch_index, si.name, si.price, max(si.date) date, sum(si.count) count
            from shop_items_2 si
            left join (select id, shop_id, fetch_index from shop_items_aggr) ag on si.shop_id = ag.shop_id and si.fetch_index = ag.fetch_index
            where ag.id is null
            group by si.shop_id, si.fetch_index, si.name, si.price
        `);

        // await this._connection.query(`truncate table deal`);

        await this._connection.query(`
            insert into deal(shop_id, date_from, date_to, name, price, count_before, count_after, sold_count)
            select si1.shop_id,
                   date_add(fd.date, interval -4 hour) f,
                   fd.date t,
                   si1.name,
                   si1.price,
                   si1.count,
                   ifnull(si2.count, 0) count2,
                   si1.count - ifnull(si2.count, 0) delta
            from
                   shop_items_aggr si1
                   left join shop_items_aggr si2 on si1.shop_id = si2.shop_id and si1.fetch_index + 1 = si2.fetch_index and si1.name = si2.name and si1.price = si2.price
                   left join (select shop_id, fetch_index, max(date) date from shop_items_aggr group by shop_id, fetch_index) fd on fd.shop_id = si1.shop_id and fd.fetch_index = si1.fetch_index + 1
            where 1 = 1
                   and fd.date is not null
                   and (si2.count is null or si1.count > si2.count)
                   and fd.date > (select ifnull(max(date_to), MAKEDATE(2000, 1)) from deal)
            order by fd.date 
        `);
    }
}

export default DealsHistoryExtractor;
