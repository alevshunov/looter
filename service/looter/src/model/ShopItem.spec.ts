import {ShopItem} from "./ShopItem";

describe('ShopItem', () => {
    it('should build correctly', () => {
        const name = 'Stem';
        const price = 1000;
        const count = 50;

        const shopItem = new ShopItem(name, price, count);

        expect(shopItem).toBeInstanceOf(ShopItem);
        expect(shopItem.name).toBe(name);
        expect(shopItem.price).toBe(price);
        expect(shopItem.count).toBe(count);
    });
});