import {CardLooter} from "./CardLooter";
import {SimpleEvent} from "../../core/SimpleEvent";
import {FreeRoEventArgs} from "../hub/FreeRoEventArgs";

describe('CardLooter', () => {
    it('should be created correctly', () => {
        const looter = new CardLooter(new SimpleEvent<FreeRoEventArgs>());

        expect(looter).toBeInstanceOf(CardLooter);
    });


    it('should dispatch card drop', () => {
        expect.assertions(3);

        const extEventArgs = new FreeRoEventArgs(
            "FreeRO",
            "#main : [Server] 'ponoroshku' выбил 'Hydra Card'. Грац!",
            new Date(2017, 2, 5));

        const extEvent = new SimpleEvent<FreeRoEventArgs>();

        const looter = new CardLooter(extEvent);

        looter.onEvent().subscribe((sender, args) => {
           expect(args.date).toBe(extEventArgs.date);
           expect(args.card).toBe('Hydra Card');
           expect(args.owner).toBe('ponoroshku');
        });

        extEvent.do(extEventArgs);
    });


    it('should not dispatch fake card drop', () => {

        const extEventArgs = new FreeRoEventArgs(
            "#main : [Server] 'ponoroshku' выбил 'Hydra Card'. Грац!",
            "FreeR0",
            new Date(2017, 2, 5));

        const extEvent = new SimpleEvent<FreeRoEventArgs>();
        const mockCallback = jest.fn();
        const looter = new CardLooter(extEvent);

        looter.onEvent().subscribe(mockCallback);

        extEvent.do(extEventArgs);

        expect(mockCallback.mock.calls.length).toBe(0);
    });
});