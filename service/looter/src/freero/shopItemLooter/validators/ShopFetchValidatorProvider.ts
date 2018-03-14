import ShopFetchValidator from './ShopFetchValidator';
import {ShopItemsLoadResult} from '../itemsLoader/ShopItemsLoadResult';
import {IShopItemStorage} from '../../../db/ShopItemStorage';
import {Shop} from '../../../model/Shop';
import {MyLogger} from '../../../../../../local_modules/my-core';

interface IShopFetchValidatorProvider {
    createFor(shop: Shop, fetchResult: ShopItemsLoadResult): ShopFetchValidator;
}

class ShopFetchValidatorProvider implements IShopFetchValidatorProvider {
    private _shopItemStorage: IShopItemStorage;
    private _logger: MyLogger;

    constructor(shopItemStorage: IShopItemStorage, logger: MyLogger) {
        this._shopItemStorage = shopItemStorage;
        this._logger = logger;
    }

    public createFor(shop: Shop, fetchResult: ShopItemsLoadResult) {
        return new ShopFetchValidator(shop, fetchResult, this._shopItemStorage, this._logger);
    }
}

export {ShopFetchValidatorProvider, IShopFetchValidatorProvider};