import ShopNameAndLocationValidator from './ShopNameAndLocationValidator';
import ShopItemsFetchValidator from './ShopItemsFetchValidator';
import {Shop} from '../../../model/Shop';
import {ILogger} from 'my-core';
import {ShopItemsLoadResult} from '../itemsLoader/ShopItemsLoadResult';
import {ShopItem} from "../../../model/ShopItem";

class ShopFetchValidator {
    private _logger: ILogger;
    private _shop: Shop;
    private _fetchResult: ShopItemsLoadResult;
    private _lastFetch: ShopItem[];


    constructor(shop: Shop, lastFetch: ShopItem[], fetchResult: ShopItemsLoadResult, logger: ILogger) {
        this._shop = shop;
        this._lastFetch = lastFetch;
        this._fetchResult = fetchResult;
        this._logger = logger;
    }

    public async isValid() : Promise<boolean> {
        const lastFetch = this._lastFetch;
        const currentFetch = this._fetchResult.items;

        const nameLocationValidator = new ShopNameAndLocationValidator(this._shop, this._fetchResult, this._logger);
        const itemsValidator = new ShopItemsFetchValidator(lastFetch, currentFetch, this._logger);

        const isValid = nameLocationValidator.isValid() && (this._shop.fetchCount === 0 || itemsValidator.isValid());

        return isValid;
    }
}

export default ShopFetchValidator;