import {SimpleEvent} from "../../core/SimpleEvent";
import {FreeRoEventArgs} from "../hub/FreeRoEventArgs";
import {ShopBuyLooter} from "./ShopBuyLooter";
import {ShopType} from "../../model/Shop";

describe('ShopBuyLooter', () => {
    it('should be created correctly', () => {
        const looter = new ShopBuyLooter(new SimpleEvent<FreeRoEventArgs>());

        expect(looter).toBeInstanceOf(ShopBuyLooter);
    });


    it('should dispatch shop open event', () => {
        expect.assertions(5);

        const extEventArgs = new FreeRoEventArgs(
            "FreeRO",
            "#main : [Server] 'Thara Frog' открывает скупку под названием 'Скупка ДОРОГО' (коорд.: um_fild01 <33,278>).",
            new Date(2019, 2, 5));

        const extEvent = new SimpleEvent<FreeRoEventArgs>();

        const looter = new ShopBuyLooter(extEvent);

        looter.onEvent().subscribe((sender, args) => {
           expect(args.date).toBe(extEventArgs.date);
           expect(args.owner).toBe('Thara Frog');
           expect(args.location).toBe('um_fild01 <33,278>');
           expect(args.name).toBe('Скупка ДОРОГО');
           expect(args.type).toBe(ShopType.Buy);
        });

        extEvent.do(extEventArgs);
    });


    it('should not dispatch fake shop message', () => {

        const extEventArgs = new FreeRoEventArgs(
            "FreeRO2",
            "#main : [Server] 'Злотый' открывает магазин 'Taming, Spore, Herb' (коорд.: izlude <92,132>).",
            new Date(2019, 2, 5));

        const extEvent = new SimpleEvent<FreeRoEventArgs>();
        const mockCallback = jest.fn();
        const looter = new ShopBuyLooter(extEvent);

        looter.onEvent().subscribe(mockCallback);

        extEvent.do(extEventArgs);

        expect(mockCallback.mock.calls.length).toBe(0);
    });
});