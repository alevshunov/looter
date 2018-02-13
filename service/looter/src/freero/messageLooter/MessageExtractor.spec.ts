import {MessageExtractor} from "./MessageExtractor";
import {FreeRoEventArgs} from "../hub/FreeRoEventArgs";
import {Message} from "./Message";

describe('MessageExtractor', () => {
    it('should extract messages using real extractor by correct author and be applicable', () => {
        const expectedMessage = new Message("o","m", new Date(), "s","oo","om");
        const extractMock = jest.fn().mockReturnValue(expectedMessage);

        const extractorMock = { extract: extractMock };

        const lookupMock = jest.fn().mockReturnValue(extractorMock);
        const lookupProxy = { lookup: lookupMock };

        const extractor = new MessageExtractor(lookupProxy);
        const externalArgs = new FreeRoEventArgs('Author', 'message text', new Date());

        const actualApplicable = extractor.applicable(externalArgs);
        const actual = extractor.extract(externalArgs);

        expect(actualApplicable).toBe(true);
        expect(lookupMock.mock.calls.length).toBe(1);
        expect(lookupMock.mock.calls[0][0]).toBe('Author');
        expect(extractMock.mock.calls.length).toBe(1);
        expect(extractMock.mock.calls[0][0]).toBe(externalArgs);
        expect(actual).toBe(expectedMessage);
    });
});