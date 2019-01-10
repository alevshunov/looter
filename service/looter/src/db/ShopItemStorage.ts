import {ShopItem} from "../model/ShopItem";
import {ConnectionConfig} from "mysql";
import {Shop} from "../model/Shop";
import {MyConnection, ILogger} from "my-core";

export interface IShopItemStorage {
    add(shop: Shop, shopItems: ShopItem[]): Promise<void>;

    get(shopId: number, fetchIndex: number): Promise<ShopItem[]>;
}

export class ShopItemStorage implements IShopItemStorage {
    private _dbConnection: ConnectionConfig;
    private _logger: ILogger;

    constructor(dbConnection: ConnectionConfig, logger: ILogger) {
        this._dbConnection = dbConnection;
        this._logger = logger;
    }

    public async add(shop: Shop, shopItems: ShopItem[]) {
        const conn = new MyConnection(this._dbConnection, this._logger);
        await conn.open();

        await conn.query('START TRANSACTION');

        for (let i = 0; i < shopItems.length; i++) {
            const item = shopItems[i];
            await conn.query("insert into shop_items(shop_id, name, price, count, fetch_index, date) values (?,?,?,?,?,?);",
                shop.id, item.name, item.price, item.count, item.fetchIndex, item.date);
        }

        await conn.query('COMMIT');

        conn.close();
    }

    public async get(shopId: number, fetchIndex: number): Promise<ShopItem[]> {
        const conn = new MyConnection(this._dbConnection, this._logger);
        await conn.open();

        const items = await conn.query(
            "select * from shop_items where shop_id = ? and fetch_index = ? order by id",
            shopId, fetchIndex);

        const shopItems = items.map((x: any) => new ShopItem(x.name, x.price, x.count, x.fetch_index, x.date));

        conn.close();

        return shopItems;
    }
}