import {ShopFetchValidatorProvider} from './validators/ShopFetchValidatorProvider';
import {ShopStorage} from '../../db/ShopStorage';
import ShopLooter from './ShopLooter';
import {ShopItemStorage} from '../../db/ShopItemStorage';
import {ShopItemsLooterProvider} from './ShopItemsLooterProvider';
import {FreeRoSayHub} from '../hub/FreeRoSayHub';
import FreeRoIrcPmHandler from '../hub/FreeRoIrcPmHandler';
import {ILogger} from 'my-core';
import {ShopItemsLoaderProvider} from './itemsLoader/ShopItemsLoaderProvider';
import {ShopChangedDetectorProvider} from "./changesDetector/IShopChangedDetectorProvider";

class ShopLooterProvider {
    create(ircPmHub: FreeRoIrcPmHandler, sayHub: FreeRoSayHub, shopStorage: ShopStorage, shopItemStorage: ShopItemStorage, logger: ILogger) : ShopLooter {
        const shopItemsLoaderProvider = new ShopItemsLoaderProvider(ircPmHub, sayHub, logger);
        const shopFetchValidatorProvider = new ShopFetchValidatorProvider(shopItemStorage, logger);
        const shopChangedDetectorProvider = new ShopChangedDetectorProvider(logger);
        const shopItemsLooterProvider = new ShopItemsLooterProvider(shopStorage, shopItemStorage, shopItemsLoaderProvider, shopFetchValidatorProvider, shopChangedDetectorProvider, logger);
        const shopLooter = new ShopLooter(shopStorage, shopItemsLooterProvider);
        return shopLooter;
    }
}

export default ShopLooterProvider;