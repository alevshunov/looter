import {ConnectionConfig} from "mysql";
import {Shop} from "../model/Shop";
import {MyConnection, MyLogger} from "my-core";

export interface IShopStorage {
    add(shop: Shop): Promise<void>;

    updateFetchIndex(shop: Shop): Promise<void>;

    deactivateOtherShops(shop: Shop): Promise<void>;

    getNextShop(): Promise<Shop>;

    deactivateShops(shop: Shop): Promise<void>;

    updateRetryCount(shop: Shop, retryCounter: number): Promise<void>;

    markAsNonValid(shop: Shop): Promise<void>;
}

export class ShopStorage implements IShopStorage, IShopStorage {
    private _dbConnection: ConnectionConfig;
    private _logger: MyLogger;

    constructor(dbConnection: ConnectionConfig, logger: MyLogger) {
        this._dbConnection = dbConnection;
        this._logger = logger;
    }

    public async add(shop: Shop) {
        const conn = new MyConnection(this._dbConnection, this._logger);
        await conn.open();
        await conn.query("insert into shops(owner, name, location, date, type) values (?,?,?,?,?);",
            shop.owner, shop.name, shop.location, shop.date, shop.type);
        conn.close();
    }

    public async updateFetchIndex(shop: Shop) {
        const conn = new MyConnection(this._dbConnection, this._logger);
        await conn.open();
        await conn.query(
            "update shops set fetch_count = ?, last_fetch = now() where id = ?",
            shop.fetchCount, shop.id);

        conn.close();
    }

    public async deactivateOtherShops(shop: Shop) {
        const conn = new MyConnection(this._dbConnection, this._logger);
        await conn.open();
        await conn.query(
            "update shops set active = 0 where active = 1 and owner = ? and id != ?",
            shop.owner, shop.id);

        conn.close();
    }

    public getNextShop(): Promise<Shop> {
        return new Promise(async (resolve, reject) => {
            const conn = new MyConnection(this._dbConnection, this._logger);
            await conn.open();
            const result = await conn.query(
                `
                    select * 
                    from shops 
                    where active = 1
                    and (last_fetch < date_add(now(), interval -4 hour) or last_fetch is null) 
                    order by last_fetch asc, date desc, id desc 
                    limit 1
                `
            );

            conn.close();

            if (result.length == 0) {
                return resolve(null);
            }

            const s = result[0];
            const shop = new Shop(s.owner, s.name, s.location, s.date, s.type);
            shop.id = s.id;
            shop.date = s.date;
            shop.fetched = s.fetched;
            shop.fetchCount = s.fetch_count;
            shop.lastFetch = s.last_fetch;
            shop.active = s.active;
            shop.retryCount = s.retry_count;
            resolve(shop);
        });
    }

    public async deactivateShops(shop: Shop) {
        const conn = new MyConnection(this._dbConnection, this._logger);
        await conn.open();
        await conn.query(
            "update shops set last_fetch = now(), active = 0 where id = ?",
            shop.id);

        conn.close();
    }

    public async updateRetryCount(shop: Shop, retryCounter: number) {
        const conn = new MyConnection(this._dbConnection, this._logger);
        await conn.open();
        await conn.query(
            "update shops set retry_count = ?, last_fetch = now() where id = ?",
            retryCounter, shop.id);

        conn.close();
    }

    public async markAsNonValid(shop: Shop) {
        const conn = new MyConnection(this._dbConnection, this._logger);
        await conn.open();
        await conn.query(
            "update shops set closed_as_invalid = 1 where id = ?",
            shop.id);

        conn.close();
    }
}