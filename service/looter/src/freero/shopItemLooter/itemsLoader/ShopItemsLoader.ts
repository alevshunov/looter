import {ShopItem} from "../../../model/ShopItem";
import {Shop, ShopType} from "../../../model/Shop";
import {ShopItemsLoadResult} from "./ShopItemsLoadResult";
import {MyLogger} from "my-core";
import {FreeRoEventArgs} from '../../hub/FreeRoEventArgs';
import {ISayHub} from '../../hub/FreeRoSayHub';
import {IEventProvider} from '../../../core/IEventProvider';

export class ShopItemsLoader {
    private ITEM_EXP: RegExp = /^\[(.+?)\] -- ([0-9]+?) z \| ([0-9]+?) шт$/;
    private HEADER_EXP: RegExp = /^::::: \[ (.+?) \] \((.+?),(.+?),(.+?)\)$/;

    private NOT_FOUND_BUY_POSTFIX: string  = 'сейчас не держит открытых скупок.';
    private NOT_FOUND_SELL_POSTFIX: string  = 'сейчас не держит открытый магазин.';

    private OFFLINE_MESSAGE: string = 'Торговец не найден. Проверите никнейм?';

    private NOT_FOUND_MESSAGE: string = '';

    private WAIT_TIME = 5000;

    private _pmHub: IEventProvider<FreeRoEventArgs>;
    private _sayHub: ISayHub;

    private _pmEvent: (value?: (any)) => void;
    private _resolve: (value?: (any)) => void;
    private _reject: (reason?: any) => void;

    private _data: ShopItem[];

    private _shop: Shop;
    private _isNotFound: boolean = false;
    private _logger: MyLogger;
    private _name: string;
    private _location: string;

    constructor(shop: Shop, pmHub: IEventProvider<FreeRoEventArgs>, sayHub: ISayHub, logger: MyLogger, waitTime?: number) {
        this._shop = shop;
        this._pmHub = pmHub;
        this._sayHub = sayHub;
        this._logger = logger;

        this._data = [];
        this._pmEvent = this.handle.bind(this);

        this.WAIT_TIME = waitTime || this.WAIT_TIME;

        this.NOT_FOUND_MESSAGE = `[${shop.owner}] ${this._shop.type == ShopType.Sell ? this.NOT_FOUND_SELL_POSTFIX : this.NOT_FOUND_BUY_POSTFIX}`;
    }

    public getItems(): Promise<ShopItemsLoadResult> {
        return new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;

            const command = this._shop.type == ShopType.Sell ? '@shop' : '@buy';
            this._logger.log(`${command} ${this._shop.owner}`);

            this._pmHub.onEvent().subscribe(this._pmEvent);
            this._sayHub.say('FreeRO', `${command} ${this._shop.owner}`);

            setTimeout(this.success.bind(this), this.WAIT_TIME);
        });
    }

    private handle(sender: any, args: FreeRoEventArgs) {
        const from = args.author;
        const message = args.message;

        this._logger.log('PM >> ', from, message);

        if (this._isNotFound || from !== 'FreeRO') { return; }

        if (message == this.OFFLINE_MESSAGE || message == this.NOT_FOUND_MESSAGE) {
            this._isNotFound = true;
            return;
        }

        if (new RegExp(this.HEADER_EXP).test(message)) {
            const parts = new RegExp(this.HEADER_EXP).exec(message);
            this._name = parts[1];
            this._location = `${parts[2]} <${parts[3]},${parts[4]}>`;
        }

        if (new RegExp(this.ITEM_EXP).test(message)) {
            const parts = new RegExp(this.ITEM_EXP).exec(message);
            const shopItem = new ShopItem(parts[1], parseInt(parts[2]), parseInt(parts[3]), this._shop.fetchCount+1, args.date);
            this._data.push(shopItem);
        }
    }

    private success() {
        this._pmHub.onEvent().unsubscribe(this._pmEvent);

        if (this._isNotFound) {
            this._logger.log('Resolve with: false (NOT FOUND)');
            this._resolve(new ShopItemsLoadResult([], true, this._name, this._location));
        } else {
            this._logger.log('Resolve with:', JSON.stringify(this._data));
            this._resolve(new ShopItemsLoadResult(this._data, false, this._name, this._location));
        }
    }
}