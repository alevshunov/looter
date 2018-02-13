import {MessageLooter} from "./MessageLooter";
import {SimpleEvent} from "../../core/SimpleEvent";
import {FreeRoEventArgs} from "../hub/FreeRoEventArgs";

describe('MessageLooter', () => {
    it('should be created correctly', () => {
        const looter = new MessageLooter(new SimpleEvent<FreeRoEventArgs>());

        expect(looter).toBeInstanceOf(MessageLooter);
    });


    it('should dispatch FreeRO messages', () => {
        expect.assertions(6);

        const extEventArgs = new FreeRoEventArgs(
            "FreeRO",
            "[КолбасычС] : мумии и изисы где водятся? Левее или лево-верх от морока? Ну осирис еще где",
            new Date(2017, 3, 2));

        const extEvent = new SimpleEvent<FreeRoEventArgs>();

        const looter = new MessageLooter(extEvent);

        looter.onEvent().subscribe((sender, args) => {
           expect(args.date).toBe(extEventArgs.date);
           expect(args.message).toBe('мумии и изисы где водятся? Левее или лево-верх от морока? Ну осирис еще где');
           expect(args.owner).toBe('КолбасычС');
           expect(args.originalMessage).toBe(extEventArgs.message);
           expect(args.originalOwner).toBe(extEventArgs.author);
           expect(args.source).toBe('FreeRO');
        });

        extEvent.do(extEventArgs);
    });

    it('should dispatch IRC messages', () => {
        expect.assertions(6);

        const extEventArgs = new FreeRoEventArgs(
            "КолбасычС",
            "мумии и изисы где водятся? Левее или лево-верх от морока? Ну осирис еще где",
            new Date(2017, 3, 2));

        const extEvent = new SimpleEvent<FreeRoEventArgs>();

        const looter = new MessageLooter(extEvent);

        looter.onEvent().subscribe((sender, args) => {
           expect(args.date).toBe(extEventArgs.date);
           expect(args.message).toBe(extEventArgs.message);
           expect(args.owner).toBe(extEventArgs.author);
           expect(args.originalMessage).toBe(extEventArgs.message);
           expect(args.originalOwner).toBe(extEventArgs.author);
           expect(args.source).toBe('IRC');
        });

        extEvent.do(extEventArgs);
    });


});