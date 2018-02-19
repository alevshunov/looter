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

    constructor(owner: string, name: string, location: string, date: Date) {
        this.owner = owner;
        this.name = name;
        this.location = location;
        this.date = date;
    }
}