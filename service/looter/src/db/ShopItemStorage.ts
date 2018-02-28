import {ShopItem} from "../model/ShopItem";
import {ConnectionConfig} from "mysql";
import {Shop} from "../model/Shop";
import {MyConnection, MyLogger} from "my-core";

export class ShopItemStorage {
    private _dbConnection: ConnectionConfig;
    private _logger: MyLogger;

    constructor(dbConnection: ConnectionConfig, logger: MyLogger) {
        this._dbConnection = dbConnection;
        this._logger = logger;
    }

    async add(shop: Shop, shopItems: ShopItem[]) {
        const conn = new MyConnection(this._dbConnection, this._logger);
        await conn.open();

        for (let i=0; i<shopItems.length; i++) {
            const item = shopItems[i];
            await conn.query("insert into shop_items(shop_id, name, price, count, fetch_index, date) values (?,?,?,?,?,?);",
                shop.id, item.name, item.price, item.count, item.fetchIndex, item.date);
        }

        conn.close();
    }
}