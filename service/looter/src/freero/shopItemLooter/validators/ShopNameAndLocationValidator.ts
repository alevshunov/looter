import {ShopItemsLoadResult} from '../itemsLoader/ShopItemsLoadResult';
import {Shop} from '../../../model/Shop';
import {ILogger} from 'my-core';

class ShopNameAndLocationValidator {
    private _fetchResult: ShopItemsLoadResult;
    private _shop: Shop;
    private _logger: ILogger;


    constructor(shop: Shop, fetchResult: ShopItemsLoadResult, logger: ILogger) {
        this._fetchResult = fetchResult;
        this._shop = shop;
        this._logger = logger;
    }

    public isValid(): boolean {
        this._logger.log(`Shop  : ${this._shop.name} at ${this._shop.location}`);
        this._logger.log(`Fetch : ${this._fetchResult.name} at ${this._fetchResult.location}`);

        const isValid = this._shop.location === this._fetchResult.location && this._shop.name === this._fetchResult.name;

        this._logger.log(`Is valid = ${isValid}`);

        return isValid;
    }
}

export default ShopNameAndLocationValidator;