import {MyConnection} from 'my-core';

class DealsHistoryExtractor {
    private _connection: MyConnection;

    constructor(connection: MyConnection) {
        this._connection = connection;
    }

    async extract() {
        await this._connection.query(`truncate table shop_items_aggr`);

        await this._connection.query(`
            insert into shop_items_aggr(shop_id, fetch_index, name, price, date, count)
            select shop_id, fetch_index, name, price, max(date) date, sum(count) count
            from shop_items si
            group by shop_id, fetch_index, name, price`);

        await this._connection.query(`truncate table deal`);

        await this._connection.query(`
            insert into deal(shop_id, date_from, date_to, name, price, count_before, count_after, sold_count)
            select 
            si1.shop_id, 
            si1.date, 
            ifnull(si2.date, date_add(si1.date, interval 4 hour)),
            si1.name, 
            si1.price, 
            si1.count, 
            ifnull(si2.count, 0) count2, 
            si1.count - ifnull(si2.count, 0) delta 
            
            from shop_items_aggr si1 
            left join shop_items_aggr si2 
            on 
            si1.shop_id = si2.shop_id and 
            si1.fetch_index + 1 = si2.fetch_index and 
            si1.name = si2.name and
            si1.price = si2.price
            
            inner join (
            select shop_id id, max(fetch_index) fetch_count
            from shop_items_aggr
            group by shop_id
            ) s on s.id = si1.shop_id
            
            inner join shops rs on rs.id = s.id
            
            where s.fetch_count > si1.fetch_index
            and (si2.count is null or si1.count > si2.count)
            
            order by si1.date desc        
        `);
    }
}

export default DealsHistoryExtractor;
