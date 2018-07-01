import {MyLogger} from 'my-core';
import {ShopItem} from '../../../model/ShopItem';

class ShopItemsFetchValidator {
    private _prev: ShopItem[];
    private _curr: ShopItem[];
    private _logger: MyLogger;

    constructor(prev: ShopItem[], curr: ShopItem[], logger: MyLogger) {
        this._prev = prev;
        this._curr = curr;
        this._logger = logger;
    }

    public isValid(): boolean {
        const last = this._prev;
        const curr = this._curr;

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
                    `Invalid fetch: not found element: curr[${currIndex}].name = ${curr[currIndex].name}, ` +
                    `curr[${currIndex}].price = ${curr[currIndex].price}, ` +
                    `curr[${currIndex}].count = ${curr[currIndex].count}.`
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