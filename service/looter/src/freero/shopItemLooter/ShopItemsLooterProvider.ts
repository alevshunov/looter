import {ShopItemsLooter} from './ShopItemsLooter';
import {IShopFetchValidatorProvider} from './validators/ShopFetchValidatorProvider';
import {IShopItemsLoaderProvider} from './itemsLoader/ShopItemsLoaderProvider';
import {IShopStorage} from '../../db/ShopStorage';
import {IShopItemStorage} from '../../db/ShopItemStorage';
import {Shop} from '../../model/Shop';
import {MyLogger} from 'my-core';

interface IShopItemsLooterProvider {
    createFor(shop: Shop): void;
}

class ShopItemsLooterProvider implements IShopItemsLooterProvider {
    private _shopStorage: IShopStorage;
    private _shopItemStorage: IShopItemStorage;
    private _shopItemsLoaderProvider: IShopItemsLoaderProvider;
    private _shopFetchValidatorProvider: IShopFetchValidatorProvider;
    private _logger: MyLogger;

    constructor(shopStorage: IShopStorage,
                shopItemStorage: IShopItemStorage,
                shopItemsLoaderProvider: IShopItemsLoaderProvider,
                shopFetchValidatorProvider: IShopFetchValidatorProvider,
                logger: MyLogger) {
        this._shopStorage = shopStorage;
        this._shopItemStorage = shopItemStorage;
        this._shopItemsLoaderProvider = shopItemsLoaderProvider;
        this._shopFetchValidatorProvider = shopFetchValidatorProvider;
        this._logger = logger;
    }

    createFor(shop: Shop) {
        return new ShopItemsLooter(shop,
            this._shopStorage,
            this._shopItemStorage,
            this._shopItemsLoaderProvider,
            this._shopFetchValidatorProvider,
            this._logger);
    }
}

export {ShopItemsLooterProvider, IShopItemsLooterProvider};