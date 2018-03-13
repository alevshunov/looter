import {Shop} from '../../model/Shop';
import {ShopItemsLoadResult} from './ShopItemsLoadResult';
import {ShopItemStorage} from '../../db/ShopItemStorage';
import {MyLogger} from '../../../../../local_modules/my-core';

class ShopItemsFetchValidator {
    private _shop: Shop;
    private _searchResult: ShopItemsLoadResult;
    private _shopItemStorage: ShopItemStorage;
    private _logger: MyLogger;

    constructor(shop: Shop, searchResult: ShopItemsLoadResult, shopItemStorage: ShopItemStorage, logger: MyLogger) {
        this._shop = shop;
        this._searchResult = searchResult;
        this._shopItemStorage = shopItemStorage;
        this._logger = logger;
    }

    public async validate(): Promise<boolean> {
        const last = await this._shopItemStorage.get(this._shop.id, this._shop.fetchCount);
        const curr = this._searchResult.items;

        this._logger.log('Validate last fetch with current:');
        this._logger.log('Last: ', JSON.stringify(last));
        this._logger.log('Curr: ', JSON.stringify(curr));

        let lastIndex=0, currIndex=0;

        while(currIndex < curr.length) {
            while (lastIndex < last.length &&
                    !(
                        last[lastIndex].name === curr[currIndex].name
                        && last[lastIndex].price === curr[currIndex].price
                        && last[lastIndex].count >= curr[currIndex].count
                    )
                ) {
                lastIndex++;
            }

            if (!last[lastIndex]) {
                this._logger.log(
                    'Not found element: curr[', currIndex, '].name = ', curr[currIndex].name,
                    'curr[', currIndex, '].price = ', curr[currIndex].price
                );

                return false;
            }

            currIndex++;
        }

        this._logger.log('Is valid fetch.');

        return true;
    }
}

export default ShopItemsFetchValidator;