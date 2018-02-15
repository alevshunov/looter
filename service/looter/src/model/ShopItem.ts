export class ShopItem {
    public name: string;
    public price: number;
    public count: number;


    constructor(name: string, price: number, count: number) {
        this.name = name;
        this.price = price;
        this.count = count;
    }
}