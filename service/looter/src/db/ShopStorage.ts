import {Connection, ConnectionConfig} from "mysql";
import {Shop} from "../model/Shop";
import {MyConnection} from "./core/MyConnection";
import {IShopProvider} from "../freero/shopItemLooter/IShopProvider";
import {ShopItem} from "../model/ShopItem";

export class ShopStorage implements IShopProvider {
    private _dbConnection: ConnectionConfig;

    constructor(dbConnection: ConnectionConfig) {
        this._dbConnection = dbConnection;
    }

    async add(shop: Shop) {
        const conn = new MyConnection(this._dbConnection);
        await conn.open();
        await conn.query("insert into shops(owner, name, location, date) values (?,?,?,?);",
            shop.owner, shop.name, shop.location, shop.date);
        conn.close();
    }

    async updateFetchIndex(shop: Shop) {
        shop.fetchCount++;

        const conn = new MyConnection(this._dbConnection);
        await conn.open();
        await conn.query(
            "update shops set fetch_count = ?, last_fetch = now() where active = 1 id = ?",
            shop.fetchCount, shop.id);

        conn.close();
    }

    async deactivateOtherShops(shop: Shop) {
        const conn = new MyConnection(this._dbConnection);
        await conn.open();
        await conn.query(
            "update shops set active = 0 where active = 1 and owner = ? and id != ?",
            shop.owner, shop.id);

        conn.close();
    }

    async getNextShop(): Promise<Shop> {
        const conn = new MyConnection(this._dbConnection);
        await conn.open();
        const result = await conn.query(
            "select * from shops where active order by last_fetch limit 1",
            );

        conn.close();
        return null;
    }

    getShopItems(shop: Shop): Promise<ShopItem[]> {
        return Promise.resolve(null);
    }

}