export class ShopItem {
    public name: string;
    public price: number;
    public count: number;
    public fetchIndex: number;
    public date: Date;


    constructor(name: string, price: number, count: number, fetchIndex: number, date: Date) {
        this.name = name;
        this.price = price;
        this.count = count;
        this.fetchIndex = fetchIndex;
        this.date = date;
    }
}