import {ShopItem} from "./ShopItem";

export class Shop {
    public owner: string;
    public name: string;
    public location: string;
    public date: Date;

    // public items: ShopItem[];


    constructor(owner: string, name: string, location: string, date: Date) {
        this.owner = owner;
        this.name = name;
        this.location = location;
        this.date = date;
        // this.items = [];
    }

    // public addItem(item: ShopItem) {
    //     this.items.push(item);
    // }
}