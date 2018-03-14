import {ShopItemsLooter} from './ShopItemsLooter';
import {Shop, ShopType} from '../../model/Shop';
import {ShopItemsLoadResult} from './itemsLoader/ShopItemsLoadResult';
import {ShopItem} from '../../model/ShopItem';

describe('ShopItemsLooter', () => {
    it('should handle not found as deactivate all his shops without invalid mark', async () => {
        const date = new Date();

        const shop: Shop = new Shop('User X', 'Best price ever', 'prt_in <1,2>', date, ShopType.Sell);

        const logger = { log: jest.fn(), error: jest.fn()};

        const shopStorage = {
            deactivateOtherShops: jest.fn(),
            add: jest.fn(),
            updateFetchIndex: jest.fn(),
            getNextShop: jest.fn(),
            deactivateShops: jest.fn(),
            updateRetryCount: jest.fn(),
            markAsNonValid: jest.fn()
        };

        const shopItemStorage = {
            add: jest.fn(),
            get: jest.fn()
        };

        const shopItemsLoaderProvider = {
            createFor: jest.fn().mockReturnValue({
                getItems: jest.fn().mockReturnValue(
                    new ShopItemsLoadResult([], true, '', '')
                )
            })
        };

        const shopFetchValidatorProvider = {
            createFor: jest.fn().mockReturnValue({
                isValid: jest.fn().mockReturnValue(false)
            })
        };

        const looter = new ShopItemsLooter(shop, shopStorage, shopItemStorage, shopItemsLoaderProvider, shopFetchValidatorProvider, logger);

        await looter.run();


        expect(shopStorage.deactivateOtherShops.mock.calls.length).toEqual(1);
        expect(shopStorage.deactivateOtherShops.mock.calls[0][0]).toBe(shop);
        expect(shopStorage.deactivateShops.mock.calls.length).toEqual(1);
        expect(shopStorage.deactivateShops.mock.calls[0][0]).toBe(shop);
        expect(shopStorage.markAsNonValid.mock.calls.length).toEqual(0);
        expect(shopFetchValidatorProvider.createFor.mock.calls.length).toEqual(0);
    });


    it('should handle found but empty result as try again', async () => {
        const date = new Date();

        const shop: Shop = new Shop('User X', 'Best price ever', 'prt_in <1,2>', date, ShopType.Sell);
        shop.retryCount = 2;

        const logger = { log: jest.fn(), error: jest.fn()};

        const shopStorage = {
            deactivateOtherShops: jest.fn(),
            add: jest.fn(),
            updateFetchIndex: jest.fn(),
            getNextShop: jest.fn(),
            deactivateShops: jest.fn(),
            updateRetryCount: jest.fn(),
            markAsNonValid: jest.fn()
        };

        const shopItemStorage = {
            add: jest.fn(),
            get: jest.fn()
        };

        const shopItemsLoaderProvider = {
            createFor: jest.fn().mockReturnValue({
                getItems: jest.fn().mockReturnValue(
                    new ShopItemsLoadResult([], false, '', '')
                )
            })
        };

        const shopFetchValidatorProvider = {
            createFor: jest.fn().mockReturnValue({
                isValid: jest.fn().mockReturnValue(false)
            })
        };

        const looter = new ShopItemsLooter(shop, shopStorage, shopItemStorage, shopItemsLoaderProvider, shopFetchValidatorProvider, logger);

        await looter.run();


        expect(shopStorage.deactivateOtherShops.mock.calls.length).toEqual(1);
        expect(shopStorage.deactivateOtherShops.mock.calls[0][0]).toBe(shop);
        expect(shopStorage.updateRetryCount.mock.calls.length).toEqual(1);
        expect(shopStorage.updateRetryCount.mock.calls[0][0]).toBe(shop);
        expect(shopStorage.updateRetryCount.mock.calls[0][1]).toBe(3);
        expect(shopStorage.markAsNonValid.mock.calls.length).toEqual(0);
        expect(shopFetchValidatorProvider.createFor.mock.calls.length).toEqual(0);
    });


    it('should handle found but empty result as deactivate after six retry with invalid', async () => {
        const date = new Date();

        const shop: Shop = new Shop('User X', 'Best price ever', 'prt_in <1,2>', date, ShopType.Sell);
        shop.retryCount = 6;

        const logger = { log: jest.fn(), error: jest.fn()};

        const shopStorage = {
            deactivateOtherShops: jest.fn(),
            add: jest.fn(),
            updateFetchIndex: jest.fn(),
            getNextShop: jest.fn(),
            deactivateShops: jest.fn(),
            updateRetryCount: jest.fn(),
            markAsNonValid: jest.fn()
        };

        const shopItemStorage = {
            add: jest.fn(),
            get: jest.fn()
        };

        const shopItemsLoaderProvider = {
            createFor: jest.fn().mockReturnValue({
                getItems: jest.fn().mockReturnValue(
                    new ShopItemsLoadResult([], false, '', '')
                )
            })
        };

        const shopFetchValidatorProvider = {
            createFor: jest.fn().mockReturnValue({
                isValid: jest.fn().mockReturnValue(false)
            })
        };

        const looter = new ShopItemsLooter(shop, shopStorage, shopItemStorage, shopItemsLoaderProvider, shopFetchValidatorProvider, logger);

        await looter.run();


        expect(shopStorage.deactivateOtherShops.mock.calls.length).toEqual(1);
        expect(shopStorage.deactivateOtherShops.mock.calls[0][0]).toBe(shop);
        expect(shopStorage.deactivateShops.mock.calls.length).toEqual(1);
        expect(shopStorage.deactivateShops.mock.calls[0][0]).toBe(shop);
        expect(shopStorage.markAsNonValid.mock.calls.length).toEqual(1);
        expect(shopStorage.markAsNonValid.mock.calls[0][0]).toBe(shop);
        expect(shopFetchValidatorProvider.createFor.mock.calls.length).toEqual(0);
    });


    it('should call validate for found items and disable for non valid', async () => {
        const date = new Date();

        const shop: Shop = new Shop('User X', 'Best price ever', 'prt_in <1,2>', date, ShopType.Sell);
        shop.retryCount = 6;

        const logger = { log: jest.fn(), error: jest.fn()};

        const shopStorage = {
            deactivateOtherShops: jest.fn(),
            add: jest.fn(),
            updateFetchIndex: jest.fn(),
            getNextShop: jest.fn(),
            deactivateShops: jest.fn(),
            updateRetryCount: jest.fn(),
            markAsNonValid: jest.fn()
        };

        const shopItemStorage = {
            add: jest.fn(),
            get: jest.fn()
        };

        const loadResult = new ShopItemsLoadResult([
            new ShopItem('Item A', 100000, 20, 5, date)
        ], false, 'Shop Name Z', 'prontera <19,99>');

        const shopItemsLoaderProvider = {
            createFor: jest.fn().mockReturnValue({
                getItems: jest.fn().mockReturnValue(
                    loadResult
                )
            })
        };

        const isValidFn = jest.fn().mockReturnValue(false);

        const shopFetchValidatorProvider = {
            createFor: jest.fn().mockReturnValue({
                isValid: isValidFn
            })
        };

        const looter = new ShopItemsLooter(shop, shopStorage, shopItemStorage, shopItemsLoaderProvider, shopFetchValidatorProvider, logger);

        await looter.run();


        expect(shopStorage.deactivateOtherShops.mock.calls.length).toEqual(1);
        expect(shopStorage.deactivateOtherShops.mock.calls[0][0]).toBe(shop);

        expect(shopFetchValidatorProvider.createFor.mock.calls.length).toEqual(1);
        expect(shopFetchValidatorProvider.createFor.mock.calls[0][0]).toBe(shop);
        expect(shopFetchValidatorProvider.createFor.mock.calls[0][1]).toBe(loadResult);

        expect(isValidFn.mock.calls.length).toEqual(1);

        expect(shopStorage.deactivateShops.mock.calls.length).toEqual(1);
        expect(shopStorage.deactivateShops.mock.calls[0][0]).toBe(shop);
        expect(shopStorage.markAsNonValid.mock.calls.length).toEqual(1);
        expect(shopStorage.markAsNonValid.mock.calls[0][0]).toBe(shop);

    });


    it('should call validate for found items and process with valid result', async () => {
        const date = new Date();

        const shop: Shop = new Shop('User X', 'Best price ever', 'prt_in <1,2>', date, ShopType.Sell);
        shop.fetchCount = 4;
        shop.retryCount = 6;

        const logger = { log: jest.fn(), error: jest.fn()};

        const shopStorage = {
            deactivateOtherShops: jest.fn(),
            add: jest.fn(),
            updateFetchIndex: jest.fn(),
            getNextShop: jest.fn(),
            deactivateShops: jest.fn(),
            updateRetryCount: jest.fn(),
            markAsNonValid: jest.fn()
        };

        const shopItemStorage = {
            add: jest.fn(),
            get: jest.fn()
        };

        const loadResult = new ShopItemsLoadResult([
            new ShopItem('Item A', 100000, 20, 5, date)
        ], false, 'Shop Name Z', 'prontera <19,99>');

        const shopItemsLoaderProvider = {
            createFor: jest.fn().mockReturnValue({
                getItems: jest.fn().mockReturnValue(
                    loadResult
                )
            })
        };

        const isValidFn = jest.fn().mockReturnValue(true);

        const shopFetchValidatorProvider = {
            createFor: jest.fn().mockReturnValue({
                isValid: isValidFn
            })
        };

        const looter = new ShopItemsLooter(shop, shopStorage, shopItemStorage, shopItemsLoaderProvider, shopFetchValidatorProvider, logger);

        await looter.run();

        expect(shopStorage.deactivateOtherShops.mock.calls.length).toEqual(1);
        expect(shopStorage.deactivateOtherShops.mock.calls[0][0]).toBe(shop);

        expect(shopFetchValidatorProvider.createFor.mock.calls.length).toEqual(1);
        expect(shopFetchValidatorProvider.createFor.mock.calls[0][0]).toBe(shop);
        expect(shopFetchValidatorProvider.createFor.mock.calls[0][1]).toBe(loadResult);

        expect(isValidFn.mock.calls.length).toEqual(1);

        expect(shopStorage.updateFetchIndex.mock.calls.length).toEqual(1);
        expect(shopStorage.updateFetchIndex.mock.calls[0][0]).toBe(shop);
        expect(shop.fetchCount).toEqual(5);

        expect(shopItemStorage.add.mock.calls.length).toEqual(1);
        expect(shopItemStorage.add.mock.calls[0][0]).toBe(shop);
        expect(shopItemStorage.add.mock.calls[0][1]).toBe(loadResult.items);

        expect(shopStorage.updateRetryCount.mock.calls.length).toEqual(1);
        expect(shopStorage.updateRetryCount.mock.calls[0][0]).toBe(shop);
        expect(shopStorage.updateRetryCount.mock.calls[0][1]).toBe(0);
    });
});