import {Shop} from "../../model/Shop";
import {ShopItem} from "../../model/ShopItem";

export interface IShopProvider {
    getNextShop() : Shop;

    getShopItems(shop: Shop): ShopItem[];
}