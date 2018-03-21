import {IShopItemStorage} from "../../db/ShopItemStorage";
import {MyLogger} from "my-core";
import {Shop} from '../../model/Shop';
import {IShopStorage} from '../../db/ShopStorage';
import {IShopItemsLoaderProvider} from './itemsLoader/ShopItemsLoaderProvider';
import {IShopFetchValidatorProvider} from './validators/ShopFetchValidatorProvider';

export class ShopItemsLooter {
    private _shop: Shop;
    private _shopStorage: IShopStorage;
    private _shopItemStorage: IShopItemStorage;
    private _shopItemsLoaderProvider: IShopItemsLoaderProvider;
    private _shopFetchValidatorProvider: IShopFetchValidatorProvider;
    private _logger: MyLogger;


    constructor(
        shop: Shop,
        shopStorage: IShopStorage,
        shopItemStorage: IShopItemStorage,
        shopItemsLoaderProvider: IShopItemsLoaderProvider,
        shopFetchValidatorProvider: IShopFetchValidatorProvider,
        logger: MyLogger) {

        this._shop = shop;
        this._shopStorage = shopStorage;
        this._shopItemStorage = shopItemStorage;
        this._shopItemsLoaderProvider = shopItemsLoaderProvider;
        this._shopFetchValidatorProvider = shopFetchValidatorProvider;
        this._logger = logger;
    }

    async run() {
        try {
            const shop = this._shop;

            this._logger.log('SHOP DETECTED', JSON.stringify(shop));

            this._logger.log('DEACTIVATE OLD SHOP');
            await this._shopStorage.deactivateOtherShops(shop);

            this._logger.log('GET SHOP ITEMS');
            const fetchResult = await this._shopItemsLoaderProvider.createFor(shop).getItems();

            if (fetchResult.isNotFound) {
                this._logger.log('DEACTIVATE SHOP');
                await this._shopStorage.deactivateShops(shop);
                return;
            }

            if (fetchResult.isBusy) {
                this._logger.log('BUSY');
                await this._shopStorage.updateRetryCount(shop, shop.retryCount + 1);
                return;
            }

            if (fetchResult.items.length === 0) {
                this._logger.log('EMPTY RESPONSE');
                await this._shopStorage.updateRetryCount(shop, shop.retryCount + 1);
                return;
            }

            const isValid = await this._shopFetchValidatorProvider.createFor(shop, fetchResult).isValid();
            this._logger.log('Is valid = ', isValid);

            if (!isValid) {
                this._logger.log('DEACTIVATE SHOP');
                await this._shopStorage.deactivateShops(shop);
                await this._shopStorage.markAsNonValid(shop);

                this._logger.log('CREATE NEW SHOP');
                await this._shopStorage.add(new Shop(shop.owner, fetchResult.name, fetchResult.location, fetchResult.date, shop.type));
                return;
            }

            shop.fetchCount++;

            this._logger.log('UPDATE SHOP FETCH INDEX');
            await this._shopStorage.updateFetchIndex(shop);
            await this._shopItemStorage.add(shop, fetchResult.items);
            await this._shopStorage.updateRetryCount(shop, 0);

        } catch(e) {
            this._logger.log('EXCEPTION', e);
            throw e;
        }
    }


}
