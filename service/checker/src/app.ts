import { MyConnection, ILogger } from 'my-core';
import {MyLogger} from 'my-core/MyLogger';

class Checker {
    private _connection: MyConnection;
    private _logger: ILogger;

    constructor() {
        const dbConnection = {
            host: process.env.LOOTER_DB_HOST,
            user: process.env.LOOTER_DB_USER,
            password: process.env.LOOTER_DB_PASSWORD,
            database: process.env.LOOTER_DB_DBNAME
        };

        this._logger = new MyLogger();
        this._connection = new MyConnection(dbConnection, new MyLogger());
    }

    async check() {
        try {
            await this._connection.open();

            let shops = await this.getShops();

            for (let i = 0; i < shops.length; i++) {
                let shop = shops[i];
                try {
                    await this.checkShop(shop);
                } catch (e) {
                    this._logger.error(e);
                    return;
                }
            }
        }
        finally {
            this._connection.close();
        }
    }

    private getShops() {
        return this._connection.query('select * from shops order by id');
    }

    private getShopItems(shopId: number, fetchIndex: number) {
        return this._connection.query(
            'select * from shop_items where shop_id = ? and fetch_index = ? order by fetch_index, id',
            shopId, fetchIndex
        );
    }

    private async checkShop(shop) {
        this._logger.log();
        this._logger.log('--------');
        this._logger.log('Check shop:', shop.id, shop.name, shop.owner);
        this._logger.log('--------');
        this._logger.log();

        let items = new Array(shop.fetch_count+1);

        for (let index = 1; index<=shop.fetch_count; index++) {
            items[index] = await this.getShopItems(shop.id, index);
        }

        let history = [];

        for (let index = 1; index<=shop.fetch_count; index++) {
            let curr = items[index];

            if (index === 1) {
                for (let i = 0; i < curr.length; i++) {
                    history.push({name: curr[i].name, price: curr[i].price, count: [curr[i].count], lastIndex: 1});
                }

                continue;
            }


            let j = 0;
            for (let i=0; i<curr.length; i++) {
                let c = curr[i];
                while (j < history.length && !
                    (
                        history[j].name === c.name
                        && history[j].price === c.price
                        && history[j].lastIndex === index - 1
                        && history[j].count[history[j].lastIndex-1] >= c.count
                    )
                    ) {
                    j++
                }

                if (!history[j]) {
                    this._logger.log(this.stringify(history));
                    throw `Shop: ${shop.id}, ${c.name} appeared in ${index} fetch with price ${c.price} and ${c.count} count but not exist before!`;
                }

                history[j].count.push(c.count);
                history[j].lastIndex = index;
            }
        }

        this._logger.log(this.stringify(history));

        for (let i=0; i<history.length; i++) {
            for (let j=1; j<history[i].count.length; j++) {
                if (history[i].count[j-1] < history[i].count[j]) {
                    throw `Shop: ${shop.id}, incorrect count in ${history[i].name} on ${j} fetch!`;
                }
            }
        }

        this._logger.log('OK');
    }

    stringify(history) {
        for (let i=0; i<history.length; i++) {
            this._logger.log(`${history[i].name}\t${history[i].price}:\t${history[i].count.join(', ')}`);
        }
    }
}

try {
    new Checker().check();
} catch(e) {
    console.log(e);
}