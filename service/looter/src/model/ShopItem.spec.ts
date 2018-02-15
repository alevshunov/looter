import {ShopItem} from "./ShopItem";

describe('ShopItem', () => {
    it('should build correctly', () => {
        const name = 'Stem';
        const price = 1000;
        const count = 50;
        const fetchIndex = 4;
        const date = new Date();

        const shopItem = new ShopItem(name, price, count, fetchIndex, date);

        expect(shopItem).toBeInstanceOf(ShopItem);
        expect(shopItem.name).toBe(name);
        expect(shopItem.price).toBe(price);
        expect(shopItem.count).toBe(count);
        expect(shopItem.fetchIndex).toBe(fetchIndex);
        expect(shopItem.date).toBe(date);
    });
});