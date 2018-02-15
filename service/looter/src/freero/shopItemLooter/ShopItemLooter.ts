import {ShopStorage} from "../../db/ShopStorage";
import {ShopItemStorage} from "../../db/ShopItemStorage";
import {IShopProvider} from "./IShopProvider";

export class ShopItemLooter {
    private SCAN_INTERVAL: number = 10000;

    private _shopProvider: IShopProvider;
    private _shopItemsStore: ShopItemStorage;
    private _shopStorege: ShopStorage;

    constructor(shopProvider: IShopProvider) {
        this._shopProvider = shopProvider;

        this.waitNext();
    }

    private async tick() {
        try {
            const shop = await this._shopProvider.getNextShop();
            if (!shop) {
                return this.waitNext();
            }

            this._shopStorege.updateFetchIndex(shop);

            const shopItems = await this._shopProvider.getShopItems(shop);

            await this._shopItemsStore.add(shopItems);

            this.waitNext();

        } catch (e) {
            return this.waitNext();
        }
    }

    private waitNext() {
        setTimeout(this.tick.bind(this), this.SCAN_INTERVAL);
    }
}
