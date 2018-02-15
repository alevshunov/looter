import {Shop} from "./Shop";
import {ShopItem} from "./ShopItem";

export interface IShopProvider {
    getNextShop() : Shop;

    getShopItems(shop: Shop): ShopItem[];
}