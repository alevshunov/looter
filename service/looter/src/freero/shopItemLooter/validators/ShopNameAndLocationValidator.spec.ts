import ShopNameAndLocationValidator from './ShopNameAndLocationValidator';
import {Shop, ShopType} from '../../../model/Shop';
import {ShopItemsLoadResult} from '../itemsLoader/ShopItemsLoadResult';

describe('ShopNameAndLocationValidator', () => {
    const emptyLogger = { log: () => {}, error: () => {} };

    it('should be true for the same location and name', () => {
        const shop: Shop = new Shop('User A', 'Best shop ever', 'prontera <101,213>', new Date(), ShopType.Sell);
        const fetchResult: ShopItemsLoadResult = new ShopItemsLoadResult([], false, 'Best shop ever', 'prontera <101,213>');

        const validator = new ShopNameAndLocationValidator(shop, fetchResult, emptyLogger);

        const actual = validator.isValid();
        const expected = true;

        expect(actual).toBe(expected);
    });


    it('should be false for the same location and wrong name', () => {
        const shop: Shop = new Shop('User A', 'Best shop ever', 'prontera <101,213>', new Date(), ShopType.Sell);
        const fetchResult: ShopItemsLoadResult = new ShopItemsLoadResult([], false, 'Best shop ever again', 'prontera <101,213>');

        const validator = new ShopNameAndLocationValidator(shop, fetchResult, emptyLogger);

        const actual = validator.isValid();
        const expected = false;

        expect(actual).toBe(expected);
    });


    it('should be false for the wrong location and the same name', () => {
        const shop: Shop = new Shop('User A', 'Best shop ever', 'prontera <101,213>', new Date(), ShopType.Sell);
        const fetchResult: ShopItemsLoadResult = new ShopItemsLoadResult([], false, 'Best shop ever', 'morroc <102,213>');

        const validator = new ShopNameAndLocationValidator(shop, fetchResult, emptyLogger);

        const actual = validator.isValid();
        const expected = false;

        expect(actual).toBe(expected);
    });


    it('should be false for the wrong location and name', () => {
        const shop: Shop = new Shop('User A', 'Best shop ever', 'prontera <101,213>', new Date(), ShopType.Sell);
        const fetchResult: ShopItemsLoadResult = new ShopItemsLoadResult([], false, 'Best shop ever again', 'morroc <102,213>');

        const validator = new ShopNameAndLocationValidator(shop, fetchResult, emptyLogger);

        const actual = validator.isValid();
        const expected = false;

        expect(actual).toBe(expected);
    });
});