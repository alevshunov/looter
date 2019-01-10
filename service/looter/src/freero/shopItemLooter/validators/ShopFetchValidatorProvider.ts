import ShopFetchValidator from './ShopFetchValidator';
import {ShopItemsLoadResult} from '../itemsLoader/ShopItemsLoadResult';
import {IShopItemStorage} from '../../../db/ShopItemStorage';
import {Shop} from '../../../model/Shop';
import {ILogger} from 'my-core';
import {ShopItem} from "../../../model/ShopItem";

interface IShopFetchValidatorProvider {
    createFor(shop: Shop, lastFetch: ShopItem[], fetchResult: ShopItemsLoadResult): ShopFetchValidator;
}

class ShopFetchValidatorProvider implements IShopFetchValidatorProvider {
    private _shopItemStorage: IShopItemStorage;
    private _logger: ILogger;

    constructor(shopItemStorage: IShopItemStorage, logger: ILogger) {
        this._shopItemStorage = shopItemStorage;
        this._logger = logger;
    }

    public createFor(shop: Shop, lastFetch: ShopItem[], fetchResult: ShopItemsLoadResult) {
        return new ShopFetchValidator(shop, lastFetch, fetchResult, this._logger);
    }
}

export {ShopFetchValidatorProvider, IShopFetchValidatorProvider};