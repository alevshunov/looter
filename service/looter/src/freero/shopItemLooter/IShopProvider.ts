import {Shop} from "../../model/Shop";
import {ShopItem} from "../../model/ShopItem";

export interface IShopProvider {
    getNextShop() : Promise<Shop>;

    deactivateOtherShops(shop: Shop): void;

    updateFetchIndex(shop: Shop): void;

    deactivateShops(shop: Shop): void;

    updateRetryCount(shop: Shop, retryCounter: number): void;

    markAsNonValid(shop: Shop): void;
}