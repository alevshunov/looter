import {ExternalEventExtractor} from "./ExternalEventExtractor";
import {SimpleEvent} from "./SimpleEvent";



describe('ExternalEventExtractor', () => {
    const simpleEvent = new SimpleEvent<any>();

    it('should call extract with correct args when applicable', () => {
        const source : object = {a: 1};

        const mockExtract = jest.fn().mockReturnValue(expect);

        const extractor = new ExternalEventExtractor<any, any>(
            simpleEvent,
            {
                applicable: () => true,
                extract: mockExtract
            }
        );

        simpleEvent.do(source);

        expect(mockExtract.mock.calls.length).toBe(1);
    });

    it('should not call extract when not applicable', () => {
        const source : object = {a: 1};

        const mockExtract = jest.fn().mockReturnValue(expect);

        const extractor = new ExternalEventExtractor<any, any>(
            simpleEvent,
            {
                applicable: () => false,
                extract: mockExtract
            }
        );

        simpleEvent.do(source);
        expect(mockExtract.mock.calls.length).toBe(0);
    });

    it('should dispatch with correct sender and value from extract when applicable', () => {
        const result = {a: 1};
        const mockExtract = jest.fn().mockReturnValue(result);
        const mockCallback = jest.fn();

        const extractor = new ExternalEventExtractor<any, any>(
            simpleEvent,
            {
                applicable: () => true,
                extract: mockExtract
            }
        );

        extractor.onEvent().subscribe(mockCallback);
        simpleEvent.do({});

        expect(mockCallback.mock.calls.length).toBe(1);
        expect(mockCallback.mock.calls[0][0]).toBe(extractor);
        expect(mockCallback.mock.calls[0][1]).toBe(result);
    });

    it('should not dispatch when not applicable', () => {
        const result = {a: 1};
        const mockExtract = jest.fn().mockReturnValue(result);
        const mockCallback = jest.fn();

        const extractor = new ExternalEventExtractor<any, any>(
            simpleEvent,
            {
                applicable: () => false,
                extract: mockExtract
            }
        );

        extractor.onEvent().subscribe(mockCallback);
        simpleEvent.do({});

        expect(mockCallback.mock.calls.length).toBe(0);
    });
});