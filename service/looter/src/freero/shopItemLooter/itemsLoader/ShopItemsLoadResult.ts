import {ShopItem} from "../../../model/ShopItem";

export class ShopItemsLoadResult {
    public items: ShopItem[];
    public isBusy: boolean;
    public isNotFound: boolean;
    public name: string;
    public location: string;
    public date: Date;

    constructor(name: string, location: string, items: ShopItem[], date: Date, isNotFound: boolean, isBusy: boolean) {
        this.items = items;
        this.isNotFound = isNotFound;
        this.name = name;
        this.location = location;
        this.date = date;
        this.isBusy = isBusy;
    }
}