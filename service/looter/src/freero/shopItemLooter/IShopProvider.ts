import {Shop} from "../../model/Shop";
import {ShopItem} from "../../model/ShopItem";

export interface IShopProvider {
    getNextShop() : Promise<Shop> ;

    getShopItems(shop: Shop): Promise<ShopItem[]>;
}