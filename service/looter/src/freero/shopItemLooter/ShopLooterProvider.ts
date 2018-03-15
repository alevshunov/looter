import {ShopFetchValidatorProvider} from './validators/ShopFetchValidatorProvider';
import {ShopStorage} from '../../db/ShopStorage';
import ShopLooter from './ShopLooter';
import {ShopItemStorage} from '../../db/ShopItemStorage';
import {ShopItemsLooterProvider} from './ShopItemsLooterProvider';
import {FreeRoSayHub} from '../hub/FreeRoSayHub';
import FreeRoIrcPmHandler from '../hub/FreeRoIrcPmHandler';
import {MyLogger} from '../../../../../local_modules/my-core';
import {ShopItemsLoaderProvider} from './itemsLoader/ShopItemsLoaderProvider';

class ShopLooterProvider {
    create(ircPmHub: FreeRoIrcPmHandler, sayHub: FreeRoSayHub, shopStorage: ShopStorage, shopItemStorage: ShopItemStorage, logger: MyLogger) : ShopLooter {
        const shopItemsLoaderProvider = new ShopItemsLoaderProvider(ircPmHub, sayHub, logger);
        const shopFetchValidatorProvider = new ShopFetchValidatorProvider(shopItemStorage, logger);
        const shopItemsLooterProvider = new ShopItemsLooterProvider(shopStorage, shopItemStorage, shopItemsLoaderProvider, shopFetchValidatorProvider, logger);
        const shopLooter = new ShopLooter(shopItemsLooterProvider);
        return shopLooter;
    }
}

export default ShopLooterProvider;