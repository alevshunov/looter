import {ShopItem} from "../../model/ShopItem";

export class ShopItemsLoadResult {
    public items: ShopItem[];
    public isNotFound: boolean;

    constructor(items: ShopItem[], isNotFound: boolean) {
        this.items = items;
        this.isNotFound = isNotFound;
    }
}