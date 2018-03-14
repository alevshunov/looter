import {ShopItem} from "../../../model/ShopItem";

export class ShopItemsLoadResult {
    public items: ShopItem[];
    public isNotFound: boolean;
    public name: string;
    public location: string;

    constructor(items: ShopItem[], isNotFound: boolean, name: string, location: string) {
        this.items = items;
        this.isNotFound = isNotFound;
        this.name = name;
        this.location = location;
    }
}