import ShopItemsFetchValidator from './ShopItemsFetchValidator';
import {ShopItem} from '../../../model/ShopItem';

describe('ShopItemsFetchValidator', () => {
    const emptyLogger = { log: () => {}, error: () => {} };

    it('should be true for empty', () => {
        const prev: ShopItem[] = [];
        const curr: ShopItem[] = [];

        const validator = new ShopItemsFetchValidator(prev, curr, emptyLogger);

        const actual = validator.isValid();
        const expected = true;

        expect(actual).toBe(expected);
    });


    it('should be true for the same data', () => {
        const prev: ShopItem[] = [new ShopItem('Item A', 1000, 90, 1, new Date())];
        const curr: ShopItem[] = [new ShopItem('Item A', 1000, 90, 2, new Date())];

        const validator = new ShopItemsFetchValidator(prev, curr, emptyLogger);

        const actual = validator.isValid();
        const expected = true;

        expect(actual).toBe(expected);
    });


    it('should be true for less count', () => {
        const prev: ShopItem[] = [new ShopItem('Item A', 1000, 90, 1, new Date())];
        const curr: ShopItem[] = [new ShopItem('Item A', 1000, 80, 2, new Date())];

        const validator = new ShopItemsFetchValidator(prev, curr, emptyLogger);

        const actual = validator.isValid();
        const expected = true;

        expect(actual).toBe(expected);
    });


    it('should be false for more count', () => {
        const prev: ShopItem[] = [new ShopItem('Item A', 1000, 90, 1, new Date())];
        const curr: ShopItem[] = [new ShopItem('Item A', 1000, 100, 2, new Date())];

        const validator = new ShopItemsFetchValidator(prev, curr, emptyLogger);

        const actual = validator.isValid();
        const expected = false;

        expect(actual).toBe(expected);
    });


    it('should be false for more items', () => {
        const prev: ShopItem[] = [
            new ShopItem('Item A', 1000, 90, 1, new Date())
        ];

        const curr: ShopItem[] = [
            new ShopItem('Item A', 1000, 90, 2, new Date()),
            new ShopItem('Item B', 2000, 100, 2, new Date())
        ];

        const validator = new ShopItemsFetchValidator(prev, curr, emptyLogger);

        const actual = validator.isValid();
        const expected = false;

        expect(actual).toBe(expected);
    });


    it('should be true for less items', () => {
        const prev: ShopItem[] = [
            new ShopItem('Item A', 1000, 10, 1, new Date()),
            new ShopItem('Item B', 2000, 20, 1, new Date()),
            new ShopItem('Item C', 3000, 30, 1, new Date()),
            new ShopItem('Item D', 4000, 40, 1, new Date())
        ];

        const curr: ShopItem[] = [
            new ShopItem('Item B', 2000, 10, 2, new Date()),
            new ShopItem('Item D', 4000, 30, 2, new Date())
        ];

        const validator = new ShopItemsFetchValidator(prev, curr, emptyLogger);

        const actual = validator.isValid();
        const expected = true;

        expect(actual).toBe(expected);
    });


    it('should be false for wrong order', () => {
        const prev: ShopItem[] = [
            new ShopItem('Item A', 1000, 10, 1, new Date()),
            new ShopItem('Item B', 2000, 20, 1, new Date()),
            new ShopItem('Item C', 3000, 30, 1, new Date()),
            new ShopItem('Item D', 4000, 40, 1, new Date())
        ];

        const curr: ShopItem[] = [
            new ShopItem('Item D', 4000, 30, 2, new Date()),
            new ShopItem('Item B', 2000, 10, 2, new Date())
        ];

        const validator = new ShopItemsFetchValidator(prev, curr, emptyLogger);

        const actual = validator.isValid();
        const expected = false;

        expect(actual).toBe(expected);
    });


    it('should be false for other items', () => {
        const prev: ShopItem[] = [
            new ShopItem('Item A', 1000, 90, 1, new Date())
        ];

        const curr: ShopItem[] = [
            new ShopItem('Item B', 2000, 90, 2, new Date())
        ];

        const validator = new ShopItemsFetchValidator(prev, curr, emptyLogger);

        const actual = validator.isValid();
        const expected = false;

        expect(actual).toBe(expected);
    });
});