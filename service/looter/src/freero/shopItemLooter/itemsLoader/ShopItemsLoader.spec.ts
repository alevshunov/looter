import {ShopItemsLoader} from './ShopItemsLoader';
import {Shop, ShopType} from '../../../model/Shop';
import {SimpleEvent} from '../../../core/SimpleEvent';
import {FreeRoEventArgs} from '../../hub/FreeRoEventArgs';
import {ShopItem} from '../../../model/ShopItem';
import {EmptyLogger} from "my-core/MyLogger";

describe('ShopItemLoader', () => {
    const emptyLogger = new EmptyLogger();

    it('should ask @shop for sell', async () => {
        const simpleEvent = new SimpleEvent<FreeRoEventArgs>();

        const shop: Shop = new Shop('User B', 'Well done', 'izlude <12,34>', new Date(), ShopType.Sell);

        const sayHandler = {
            say: jest.fn()
        };

        const loader = new ShopItemsLoader(shop, simpleEvent, sayHandler, emptyLogger, 100);
        await loader.getItems();

        expect(sayHandler.say.mock.calls.length).toEqual(1);
        expect(sayHandler.say.mock.calls[0][0]).toEqual('FreeRO');
        expect(sayHandler.say.mock.calls[0][1]).toEqual('@shop User B');
    });


    it('should ask @buy for buy', async () => {
        const simpleEvent = new SimpleEvent<FreeRoEventArgs>();

        const shop: Shop = new Shop('User C', 'Well done', 'izlude <12,34>', new Date(), ShopType.Buy);

        const sayHandler = {
            say: jest.fn()
        };

        const loader = new ShopItemsLoader(shop, simpleEvent, sayHandler, emptyLogger, 100);
        await loader.getItems();

        expect(sayHandler.say.mock.calls.length).toEqual(1);
        expect(sayHandler.say.mock.calls[0][0]).toEqual('FreeRO');
        expect(sayHandler.say.mock.calls[0][1]).toEqual('@buy User C');
    });


    it('should fetch busy', async () => {
        const simpleEvent = new SimpleEvent<FreeRoEventArgs>();

        const shop: Shop = new Shop('User C', 'Well done', 'izlude <12,34>', new Date(), ShopType.Sell);

        const sayHandler = {
            say() {
                simpleEvent.do(new FreeRoEventArgs('FreeRO', '...Попробуйте ещё разок, через пару секунд?', new Date()));
            }
        };

        const loader = new ShopItemsLoader(shop, simpleEvent, sayHandler, emptyLogger, 100);

        const actual = await loader.getItems();

        expect(actual.isNotFound).toEqual(false);
        expect(actual.isBusy).toEqual(true);
    });


    it('should fetch not found for @shop', async () => {
        const simpleEvent = new SimpleEvent<FreeRoEventArgs>();

        const shop: Shop = new Shop('User C', 'Well done', 'izlude <12,34>', new Date(), ShopType.Sell);

        const sayHandler = {
            say() {
                simpleEvent.do(new FreeRoEventArgs('FreeRO', '[User C] сейчас не держит открытый магазин.', new Date()));
            }
        };

        const loader = new ShopItemsLoader(shop, simpleEvent, sayHandler, emptyLogger, 100);

        const actual = await loader.getItems();

        expect(actual.isNotFound).toEqual(true);
        expect(actual.isBusy).toEqual(false);
    });


    it('should fetch not found for @buy', async () => {
        const simpleEvent = new SimpleEvent<FreeRoEventArgs>();

        const shop: Shop = new Shop('User C', 'Well done', 'izlude <12,34>', new Date(), ShopType.Buy);

        const sayHandler = {
            say() {
                simpleEvent.do(new FreeRoEventArgs('FreeRO', '[User C] сейчас не держит открытых скупок.', new Date()));
            }
        };

        const loader = new ShopItemsLoader(shop, simpleEvent, sayHandler, emptyLogger, 100);

        const actual = await loader.getItems();

        expect(actual.isNotFound).toEqual(true);
        expect(actual.isBusy).toEqual(false);
    });


    it('should fetch offline for @buy', async () => {
        const simpleEvent = new SimpleEvent<FreeRoEventArgs>();

        const shop: Shop = new Shop('User C', 'Well done', 'izlude <12,34>', new Date(), ShopType.Buy);

        const sayHandler = {
            say() {
                simpleEvent.do(new FreeRoEventArgs('FreeRO', 'Торговец не найден. Проверите никнейм?', new Date()));
            }
        };

        const loader = new ShopItemsLoader(shop, simpleEvent, sayHandler, emptyLogger, 100);

        const actual = await loader.getItems();

        expect(actual.isNotFound).toEqual(true);
        expect(actual.isBusy).toEqual(false);
    });


    it('should fetch offline for @sell', async () => {
        const simpleEvent = new SimpleEvent<FreeRoEventArgs>();

        const shop: Shop = new Shop('User C', 'Well done', 'izlude <12,34>', new Date(), ShopType.Sell);

        const sayHandler = {
            say() {
                simpleEvent.do(new FreeRoEventArgs('FreeRO', 'Торговец не найден. Проверите никнейм?', new Date()));
            }
        };

        const loader = new ShopItemsLoader(shop, simpleEvent, sayHandler, emptyLogger, 100);

        const actual = await loader.getItems();

        expect(actual.isNotFound).toEqual(true);
        expect(actual.isBusy).toEqual(false);
    });


    it('should fetch empty for no response', async () => {
        const simpleEvent = new SimpleEvent<FreeRoEventArgs>();

        const shop: Shop = new Shop('User C', 'Well done', 'izlude <12,34>', new Date(), ShopType.Sell);

        const sayHandler = {
            say() {
            }
        };

        const loader = new ShopItemsLoader(shop, simpleEvent, sayHandler, emptyLogger, 100);

        const actual = await loader.getItems();

        expect(actual.isNotFound).toEqual(false);
        expect(actual.isBusy).toEqual(false);
        expect(actual.location).toEqual('');
        expect(actual.name).toEqual('');
        expect(actual.items).toEqual([]);
    });


    it('should fetch name and location from header and items with correct fetch index', async () => {
        const simpleEvent = new SimpleEvent<FreeRoEventArgs>();

        const date = new Date();

        const shop: Shop = new Shop('User C', 'Well done', 'izlude <12,34>', date, ShopType.Sell);
        shop.fetchCount = 84;

        const sayHandler = {
            say() {
                simpleEvent.do(new FreeRoEventArgs('FreeRO', '::::: [ Карандаш, дьябло роба, вайлет фир ] (alberta,116,53)', date));
                simpleEvent.do(new FreeRoEventArgs('FreeRO', '[Well-Chewed Pencil] -- 990000 z | 1 шт', date));
                simpleEvent.do(new FreeRoEventArgs('FreeRO', '[Angel Wing] -- 1200000 z | 2 шт', date));
                simpleEvent.do(new FreeRoEventArgs('FreeRO', '[Fancy Flower] -- 48500 z | 3 шт', date))
            }
        };

        const loader = new ShopItemsLoader(shop, simpleEvent, sayHandler, emptyLogger, 100);

        const actual = await loader.getItems();
        const expected = [
            new ShopItem('Well-Chewed Pencil', 990000, 1, 85, date),
            new ShopItem('Angel Wing', 1200000, 2, 85, date),
            new ShopItem('Fancy Flower', 48500, 3, 85, date)
        ];

        expect(actual.isNotFound).toEqual(false);
        expect(actual.isBusy).toEqual(false);
        expect(actual.location).toEqual('alberta <116,53>');
        expect(actual.name).toEqual('Карандаш, дьябло роба, вайлет фир');
        expect(actual.date).toEqual(date);
        expect(actual.items).toEqual(expected);
    });
});