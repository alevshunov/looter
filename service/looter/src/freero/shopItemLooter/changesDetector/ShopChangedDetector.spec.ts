import {ShopChangedDetector} from "./ShopChangedDetector";
import {ShopItem} from "../../../model/ShopItem";

describe('ShopChangedDetector', () => {
    it('should not detect changes for empty', () => {
        const parent = [];
        const current = [];

        const actual = new ShopChangedDetector(parent, current).isChanged();

        expect(actual).toBeFalsy();
    });

    it('should not detect changes for the same count', () => {
        const parent: ShopItem[] = [
            new ShopItem('A', 10000, 10, 1, new Date()),
            new ShopItem('B', 10000, 10, 1, new Date()),
        ];

        const current: ShopItem[] = [
            new ShopItem('A', 10000, 10, 1, new Date()),
            new ShopItem('B', 10000, 10, 1, new Date()),
        ];

        const actual = new ShopChangedDetector(parent, current).isChanged();

        expect(actual).toBeFalsy();
    });

    it('should detect changes for less items', () => {
        const parent: ShopItem[] = [
            new ShopItem('A', 10000, 10, 1, new Date()),
            new ShopItem('B', 10000, 10, 1, new Date()),
        ];

        const current: ShopItem[] = [
            new ShopItem('A', 10000, 10, 1, new Date())
        ];

        const actual = new ShopChangedDetector(parent, current).isChanged();

        expect(actual).toBeTruthy();
    });

    it('should detect changes for less count', () => {
        const parent: ShopItem[] = [
            new ShopItem('A', 10000, 10, 1, new Date()),
            new ShopItem('B', 10000, 10, 1, new Date()),
        ];

        const current: ShopItem[] = [
            new ShopItem('A', 10000, 10, 1, new Date()),
            new ShopItem('B', 10000, 9, 1, new Date()),
        ];

        const actual = new ShopChangedDetector(parent, current).isChanged();

        expect(actual).toBeTruthy();
    });
});