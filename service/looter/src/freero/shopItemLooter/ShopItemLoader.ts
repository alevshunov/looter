import {ShopItem} from "../../model/ShopItem";
import {Client as IrcClient} from "irc";
import {Shop, ShopType} from "../../model/Shop";
import {ShopItemsLoadResult} from "./ShopItemsLoadResult";
import {MyLogger} from "../../core/MyLogger";

export class ShopItemLoader {
    private _hub: IrcClient;
    private _pmEvent: (value?: (any)) => void;
    private _resolve: (value?: (any)) => void;
    private _reject: (reason?: any) => void;
    private _data: ShopItem[];
    private _shop: Shop;
    private ITEM_EXP: RegExp = /^\[(.+?)\] -- ([0-9]+?) z \| ([0-9]+?) шт$/;
    private _isNotFound: boolean = false;
    private _logger: MyLogger;

    constructor(shop: Shop, hub: IrcClient, logger: MyLogger) {
        this._shop = shop;
        this._hub = hub;
        this._logger = logger;
        this._data = [];
        this._pmEvent = this.handlePm.bind(this);
    }

    public getItems(): Promise<ShopItemsLoadResult> {
        return new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
            this._hub.addListener('pm', this._pmEvent);
            const command = this._shop.type == ShopType.Sell ? '@shop' : '@buy';
            this._hub.say('FreeRO', `${command} ${this._shop.owner}`);
            setTimeout(this.success.bind(this), 5000);
        });
    }

    private handlePm(from: string, message: string) {
        this._logger.log('PM >> ', from, message);

        if (message == 'Торговец не найден. Проверите никнейм?' || message == '[' + this._shop.owner + '] сейчас не держит открытый магазин.') {
            this._isNotFound = true;
            return;
        }

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
        if (this._isNotFound) {
            this._logger.log('Resolve with: false (NOT FOUND)');
            this._resolve(new ShopItemsLoadResult([], true));
        } else {
            this._logger.log('Resolve with:', JSON.stringify(this._data));
            this._resolve(new ShopItemsLoadResult(this._data, false));
        }
    }
}