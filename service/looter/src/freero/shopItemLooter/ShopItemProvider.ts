import {ShopItem} from "../../model/ShopItem";
import {Client as IrcClient} from "irc";
import {Shop} from "../../model/Shop";

export class ShopItemProvider {
    private _hub: IrcClient;
    private _pmEvent: (value?: (any)) => void;
    private _resolve: (value?: (any)) => void;
    private _reject: (reason?: any) => void;
    private _data: ShopItem[];
    private _shop: Shop;
    private ITEM_EXP: RegExp = /^\[(.+?)\] -- ([0-9]+?) z \| ([0-9]+?) шт$/;

    constructor(shop: Shop, hub: IrcClient) {
        this._shop = shop;
        this._hub = hub;
        this._data = [];
        this._pmEvent = this.handlePm.bind(this);
    }

    public getItems(): Promise<ShopItem[]> {
        return new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
            this._hub.addListener('pm', this._pmEvent);
            this._hub.say('FreeRO', '@shop ' + this._shop.owner);
            setTimeout(this.success.bind(this), 5000);
        });
    }

    private handlePm(from: string, message: string) {
        console.log('PM >> ', from, message);

        if (from !== 'FreeRO') { return; }

        if (!new RegExp(this.ITEM_EXP).test(message)) {
            return;
        }

        const parts = new RegExp(this.ITEM_EXP).exec(message);

        const shopItem = new ShopItem(parts[1], parseInt(parts[2]), parseInt(parts[3]), this._shop.fetchCount+1, new Date());
        this._data.push(shopItem);
    }

    public success() {
        this._hub.removeListener('pm', this._pmEvent);
        console.log('Resolve with:', JSON.stringify(this._data));
        this._resolve(this._data);
    }
}