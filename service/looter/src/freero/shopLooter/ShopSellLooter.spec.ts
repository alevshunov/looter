import {SimpleEvent} from "../../core/SimpleEvent";
import {FreeRoEventArgs} from "../hub/FreeRoEventArgs";
import {ShopSellLooter} from "./ShopSellLooter";
import {ShopType} from "../../model/Shop";

describe('ShopSellLooter', () => {
    it('should be created correctly', () => {
        const looter = new ShopSellLooter(new SimpleEvent<FreeRoEventArgs>());

        expect(looter).toBeInstanceOf(ShopSellLooter);
    });


    it('should dispatch shop open event', () => {
        expect.assertions(5);

        const extEventArgs = new FreeRoEventArgs(
            "FreeRO",
            "#main : [Server] 'Злотый' открывает магазин 'Taming, Spore, Herb' (коорд.: izlude <92,132>).",
            new Date(2019, 2, 5));

        const extEvent = new SimpleEvent<FreeRoEventArgs>();

        const looter = new ShopSellLooter(extEvent);

        looter.onEvent().subscribe((sender, args) => {
           expect(args.date).toBe(extEventArgs.date);
           expect(args.owner).toBe('Злотый');
           expect(args.location).toBe('izlude <92,132>');
           expect(args.name).toBe('Taming, Spore, Herb');
           expect(args.type).toBe(ShopType.Sell);
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
        const looter = new ShopSellLooter(extEvent);

        looter.onEvent().subscribe(mockCallback);

        extEvent.do(extEventArgs);

        expect(mockCallback.mock.calls.length).toBe(0);
    });
});