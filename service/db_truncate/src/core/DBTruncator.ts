import {MyConnection} from 'my-core';

type SFInfo = {shopId: number, fetchIndex: number, tf: any};

class DBTruncator {
    private _connection: MyConnection;

    constructor(connection: MyConnection) {
        this._connection = connection;
    }

    async truncate() {
        const shops = await this._connection.query(`
            select * from shops order by id
        `);

        for(let i=0; i<shops.length; i++) {
            const remove = await this.truncateShop(shops[i]);
            await this.truncateFetch(shops[i], remove);
        }
    }

    async truncateShop(shop): Promise<number[]> {
        const r: number[] = [];
        // console.log(JSON.stringify(shop, null, 2));
        console.log('-------------------------------');
        console.log(shop.id, shop.name, shop.date, shop.fetch_count);
        console.log();

        const f = await this._connection.query(`
            select * from shop_items where shop_id = ? order by id
        `, shop.id);

        let actual = f.filter(x => x.fetch_index == 1);
        console.log(1);

        for (let fetchIndex=2; fetchIndex<=shop.fetch_count; fetchIndex++) {
            const current = f.filter(x => x.fetch_index == fetchIndex);

            if (this.isTheSame(actual, current)) {
                r.push(fetchIndex);
                // console.log(fetchIndex);
                // console.log(JSON.stringify(actual, null, 2));
                // console.log(JSON.stringify(current, null, 2));
                // console.log();
            } else {
                console.log(fetchIndex);
                actual = current;
            }
        }

        return r;
    }

    isTheSame(a: any[], b: any[]): boolean {
        if (a.length != b.length) {
            return false;
        }

        for (let i=0; i<a.length; i++) {
            if (a[i].name != b[i].name || a[i].count != b[i].count || a[i].price != b[i].price) {
                return false;
            }
        }
        return true;
    }

    async truncateFetch(s: any, fetchIndexes: number[]) {
        if (fetchIndexes.length == 0) {
            return;
        }

        await this._connection.query(`delete from shop_items where shop_id = ? and fetch_index IN (?)`, s.id, fetchIndexes);

        await this._connection.query(`
            update shop_items si
            set fetch_index = (
              select count(distinct(fetch_index)) + 1
              from (select * from shop_items where shop_id = ?) s
              where s.fetch_index < si.fetch_index
              )
            where si.shop_id = ?
        `, s.id, s.id);

        await this._connection.query(`update shops set fetch_count = (select max(fetch_index) from shop_items where shop_id = ?) where id = ?`, s.id, s.id);
    }
}

export default DBTruncator;
