import {ShopItemStorage} from "../../db/ShopItemStorage";
import {IShopProvider} from "./IShopProvider";
import {ShopItemProvider} from "./ShopItemProvider";
import {Client as IrcClient} from "irc";

export class ShopItemLooter {
    private SCAN_INTERVAL: number = 30000;

    private _shopProvider: IShopProvider;
    private _shopItemStorage: ShopItemStorage;
    private _hub: IrcClient;

    constructor(shopItemStorage: ShopItemStorage, shopProvider: IShopProvider, hub: IrcClient) {
        this._shopProvider = shopProvider;
        this._shopItemStorage = shopItemStorage;
        this._hub = hub;
    }

    public run() {
        this.tick();
    }

    private async tick() {
        try {
            const shop = await this._shopProvider.getNextShop();

            if (!shop) {
                return this.waitNext();
            }

            console.log('SHOP DETECTED', shop.id, shop.owner);

            console.log('DEACTIVATE OLD SHOP', shop.id, shop.owner);
            await this._shopProvider.deactivateOtherShops(shop);

            console.log('GET SHOP ITEMS', shop.id, shop.owner);
            const shopItems = await new ShopItemProvider(shop, this._hub).getItems();

            if (shopItems.length > 0)
            {
                shop.fetchCount++;

                console.log('UPDATE SHOP FETCH INDEX', shop.id);
                await this._shopProvider.updateFetchIndex(shop);

                await this._shopItemStorage.add(shop, shopItems);

                await this._shopProvider.updateRetryCount(shop, 0);
            }

            if (shopItems.length == 0) {
                if (shop.retryCount > 3) {
                    console.log('DEACTIVETE SHOP', shop.id);
                    await this._shopProvider.deactivateShops(shop);
                } else {
                    console.log('RETRY LATER', shop.id);
                    await this._shopProvider.updateRetryCount(shop, shop.retryCount + 1);
                }
            }

            this.waitNext();

        } catch (e) {
            console.log('EXCEPTION', e);
            return this.waitNext();
        }
    }

    private waitNext() {
        setTimeout(this.tick.bind(this), this.SCAN_INTERVAL);
    }
}

