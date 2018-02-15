import {ShopItem} from "../model/ShopItem";
import {ConnectionConfig} from "mysql";
import {MyConnection} from "./core/MyConnection";
import {Shop} from "../model/Shop";

export class ShopItemStorage {
    private _dbConnection: ConnectionConfig;

    constructor(dbConnection: ConnectionConfig) {
        this._dbConnection = dbConnection;
    }

    async add(shop: Shop, shopItems: ShopItem[]) {
        const conn = new MyConnection(this._dbConnection);
        await conn.open();
        for (let i=0; i<shopItems.length; i++) {
            const item = shopItems[i];
            await conn.query("insert into shop_items(shop_id, name, price, count, fetch_index, date) values (?,?,?,?,?,?);",
                shop.id, item.name, item.price, item.count, item.fetchIndex, item.date);
        };

        conn.close();
    }
}