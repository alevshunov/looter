import {ISayHub} from '../../hub/FreeRoSayHub';
import {IEventProvider} from '../../../core/IEventProvider';
import {FreeRoEventArgs} from '../../hub/FreeRoEventArgs';
import {Shop} from '../../../model/Shop';
import {MyLogger} from '../../../../../../local_modules/my-core';
import {ShopItemsLoader} from './ShopItemsLoader';

interface IShopItemsLoaderProvider {
    createFor(shop: Shop, waitTime?: number): ShopItemsLoader;
}

class ShopItemsLoaderProvider implements IShopItemsLoaderProvider {
    private _pmHub: IEventProvider<FreeRoEventArgs>;
    private _sayHub: ISayHub;
    private _logger: MyLogger;

    constructor(pmHub: IEventProvider<FreeRoEventArgs>, sayHub: ISayHub, logger: MyLogger) {
        this._pmHub = pmHub;
        this._sayHub = sayHub;
        this._logger = logger;
    }

    public createFor(shop: Shop, waitTime?: number): ShopItemsLoader {
        return new ShopItemsLoader(shop, this._pmHub, this._sayHub, this._logger, waitTime);
    }
}

export {ShopItemsLoaderProvider, IShopItemsLoaderProvider};