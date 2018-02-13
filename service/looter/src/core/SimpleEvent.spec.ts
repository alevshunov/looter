import {SimpleEvent} from "./SimpleEvent";

it('should work', () => {
    expect(true).toBe(true);
});



describe('SimpleEvent', () => {
    it('should dispatch an event', () => {
        expect.assertions(2);

        const d = new SimpleEvent<any>();
        const argsR = { a: 'hello' };

        d.onEvent().subscribe((sender, args) => {
            expect(sender).toEqual(d);
            expect(args).toEqual(argsR);
        });

        d.do(argsR);
    });

    it('should dispatch an event multiple times', () => {
        expect.assertions(3);

        const d = new SimpleEvent<number>();
        let current = 1;

        d.onEvent().subscribe((sender, args) => {
            expect(args).toEqual(current);
            current++;
        });

        d.do(1);
        d.do(2);
        d.do(3);
    });
});