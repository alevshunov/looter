import {ShopItemStorage} from "../../db/ShopItemStorage";
import {IShopProvider} from "./IShopProvider";
import {ShopItemLoader} from "./ShopItemLoader";
import {Client as IrcClient} from "irc";
import {MyLogger} from "my-core";
import ShopItemsFetchValidator from './ShopItemsFetchValidator';

export class ShopItemLooter {
    private SCAN_FIRST_INTERVAL: number = 60000;
    private SCAN_INTERVAL: number = 30000;

    private _shopProvider: IShopProvider;
    private _shopItemStorage: ShopItemStorage;
    private _hub: IrcClient;
    private _logger: MyLogger;

    constructor(shopItemStorage: ShopItemStorage, shopProvider: IShopProvider, hub: IrcClient, logger: MyLogger) {
        this._shopProvider = shopProvider;
        this._shopItemStorage = shopItemStorage;
        this._hub = hub;
        this._logger = logger;
    }

    public run() {
        this.waitNext(true);
    }

    private async tick() {
        try {
            const shop = await this._shopProvider.getNextShop();

            if (!shop) {
                return this.waitNext();
            }

            this._logger.log('SHOP DETECTED', JSON.stringify(shop));

            this._logger.log('DEACTIVATE OLD SHOP');
            await this._shopProvider.deactivateOtherShops(shop);

            this._logger.log('GET SHOP ITEMS');
            const searchResult = await new ShopItemLoader(shop, this._hub, this._logger).getItems();

            const isValid = await new ShopItemsFetchValidator(shop, searchResult, this._shopItemStorage, this._logger)
                .validate();

            this._logger.log('Is valid = ', isValid);

            if (!searchResult.isNotFound && searchResult.items.length > 0 && isValid)
            {
                shop.fetchCount++;

                this._logger.log('UPDATE SHOP FETCH INDEX');
                await this._shopProvider.updateFetchIndex(shop);

                await this._shopItemStorage.add(shop, searchResult.items);

                await this._shopProvider.updateRetryCount(shop, 0);
            } else {
                if (searchResult.isNotFound || shop.retryCount > 5 || !isValid) {
                    this._logger.log('DEACTIVATE SHOP');
                    await this._shopProvider.deactivateShops(shop);
                    if (!isValid) {
                        await this._shopProvider.markAsNonValid(shop);
                    }
                } else {
                    this._logger.log('RETRY LATER');
                    await this._shopProvider.updateRetryCount(shop, shop.retryCount + 1);
                }
            }

            this.waitNext();

        } catch (e) {
            this._logger.log('EXCEPTION', e);
            return this.waitNext();
        }
    }

    private waitNext(first: boolean = false) {
        setTimeout(this.tick.bind(this), first ? this.SCAN_FIRST_INTERVAL : this.SCAN_INTERVAL);
    }
}

