export class Shop {
    public owner: string;
    public name: string;
    public location: string;
    public date: Date;
    public id: number;
    public fetchCount: number;
    public fetched: boolean;
    public lastFetch: Date;
    public active: boolean;
    public retryCount: number;
    public type: ShopType;

    constructor(owner: string, name: string, location: string, date: Date, type: ShopType) {
        this.owner = owner;
        this.name = name;
        this.location = location;
        this.date = date;
        this.type = type;
        this.fetchCount = 0;
    }
}

export enum ShopType {
    Sell = 'sell',
    Buy = 'buy'
}