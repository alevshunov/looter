import {SimpleEvent} from "./SimpleEvent";
import {ExternalEventAsyncExtractor} from "./ExternalEventAsyncExtractor";



describe('ExternalEventAsyncExtractor', () => {


    it('should call extract and dispatch with correct args when applicable', (done) => {
        const simpleEvent = new SimpleEvent<any>();

        expect.assertions(4);

        const source : object = {a: 1};
        const target : object = {b: 2};

        const extractor = new ExternalEventAsyncExtractor<any, any>(
            simpleEvent,
            {
                applicable: (args) => {
                    expect(args).toEqual(source);
                    return Promise.resolve(true);
                },

                extract: (args) => {
                    expect(args).toEqual(source);
                    return Promise.resolve(target);
                }
            }
        );

        simpleEvent.do(source);

        extractor.onEvent().subscribe((sender, args) => {
            expect(sender).toBe(extractor);
            expect(args).toBe(target);
            done();
        });

        extractor.onIgnoredEvent().subscribe((sender, args) => {
            done.fail();
        });
    });

    
    it('should not call extract and not dispatch when not applicable', (done) => {
        const simpleEvent = new SimpleEvent<any>();

        expect.assertions(3);

        const source : object = {a: 1};
        const target : object = {b: 2};

        const extractor = new ExternalEventAsyncExtractor<any, any>(
            simpleEvent,
            {
                applicable: (args) => {
                    expect(args).toEqual(source);
                    return Promise.resolve(false);
                },

                extract: (args) => {
                    done.fail();
                    return Promise.resolve(target);
                }
            }
        );

        simpleEvent.do(source);

        extractor.onEvent().subscribe((sender, args) => {
            done.fail();
        });

        extractor.onIgnoredEvent().subscribe((sender, args) => {
            expect(sender).toBe(extractor);
            expect(args).toBe(source);
            done();
        });
    });
});