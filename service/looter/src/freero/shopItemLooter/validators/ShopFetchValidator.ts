import ShopNameAndLocationValidator from './ShopNameAndLocationValidator';
import ShopItemsFetchValidator from './ShopItemsFetchValidator';
import {Shop} from '../../../model/Shop';
import {IShopItemStorage} from '../../../db/ShopItemStorage';
import {MyLogger} from '../../../../../../local_modules/my-core';
import {ShopItemsLoadResult} from '../itemsLoader/ShopItemsLoadResult';

class ShopFetchValidator {
    private _shopItemStorage: IShopItemStorage;
    private _logger: MyLogger;
    private _shop: Shop;
    private _fetchResult: ShopItemsLoadResult;


    constructor(shop: Shop, fetchResult: ShopItemsLoadResult, shopItemStorage: IShopItemStorage, logger: MyLogger) {
        this._shop = shop;
        this._fetchResult = fetchResult;
        this._shopItemStorage = shopItemStorage;
        this._logger = logger;
    }

    public async isValid() : Promise<boolean> {
        const lastFetch = await this._shopItemStorage.get(this._shop.id, this._shop.fetchCount);
        const currentFetch = this._fetchResult.items;

        const nameLocationValidator = new ShopNameAndLocationValidator(this._shop, this._fetchResult, this._logger);
        const itemsValidator = new ShopItemsFetchValidator(lastFetch, currentFetch, this._logger);

        const isValid = nameLocationValidator.isValid() && (this._shop.fetchCount === 0 || itemsValidator.isValid());

        return isValid;
    }
}

export default ShopFetchValidator;