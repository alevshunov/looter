import Timer from '../../core/Timer';
import {ShopStorage} from '../../db/ShopStorage';
import {ShopItemsLooterProvider} from './ShopItemsLooterProvider';

class ShopLooter {
    private SCAN_DELAY: number = 60000;
    private SCAN_INTERVAL: number = 5000;

    private _timer : Timer;

    private _shopStorage: ShopStorage;
    private _shopItemsLooterProvider: ShopItemsLooterProvider;


    constructor(shopStorage: ShopStorage, shopItemsLooterProvider: ShopItemsLooterProvider) {
        this._shopStorage = shopStorage;
        this._shopItemsLooterProvider = shopItemsLooterProvider;
        this._timer = new Timer(this.tick.bind(this), this.SCAN_INTERVAL);
    }

    public run() {
        setTimeout(this._timer.start.bind(this._timer), this.SCAN_DELAY);
    }

    public stop() {
        this._timer.stop();
    }

    private async tick() {
        const shop = await this._shopStorage.getNextShop();

        if (!shop) { return }

        await this._shopItemsLooterProvider.createFor(shop).run();
    }
}

export default ShopLooter;