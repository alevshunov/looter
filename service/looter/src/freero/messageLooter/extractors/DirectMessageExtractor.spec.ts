import {DirectMessageExtractor} from "./DirectMessageExtractor";
import {FreeRoEventArgs} from "../../hub/FreeRoEventArgs";

describe('DirectMessageExtractor', () => {

    it('should build correctly', () => {
        const extractor = new DirectMessageExtractor('IRC');
        expect(extractor).toBeInstanceOf(DirectMessageExtractor);
        expect(extractor.hub).toBe('IRC');
    });


    it('should extract correctly', () => {
        const author = 'X';
        const message = 'Hello World!';
        const date = new Date();
        const hub = 'IRC';

        const extractor = new DirectMessageExtractor(hub);
        const result = extractor.extract(new FreeRoEventArgs(author, message, date));
        expect(result).not.toBeNull();
        expect(result.originalMessage).toBe(message);
        expect(result.originalOwner).toBe(author);
        expect(result.date).toBe(date);
        expect(result.message).toBe(message);
        expect(result.owner).toBe(author);
        expect(result.source).toBe(hub);
    });
});