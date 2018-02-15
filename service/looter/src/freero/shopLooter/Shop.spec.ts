import {Shop} from "./Shop";
import {ShopItem} from "./ShopItem";

describe('Shop', () => {
    it('should build correctly', () => {
        const owner = 'Милмана';
        const name = 'gg';
        const location = 'alberta <33,236>';
        const date = new Date();

        const shop = new Shop(owner, name, location, date);

        expect(shop).toBeInstanceOf(Shop);
        expect(shop.name).toBe(name);
        expect(shop.owner).toBe(owner);
        expect(shop.location).toBe(location);
        expect(shop.date).toBe(date);
    });
});