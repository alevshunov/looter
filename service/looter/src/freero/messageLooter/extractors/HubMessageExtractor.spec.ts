import {FreeRoEventArgs} from "../../hub/FreeRoEventArgs";
import {HubMessageExtractor} from "./HubMessageExtractor";

describe('HubMessageExtractor', () => {

    it('should build correctly', () => {
        const extractor = new HubMessageExtractor('Telegram');
        expect(extractor).toBeInstanceOf(HubMessageExtractor);
        expect(extractor.hub).toBe('Telegram');
    });


    it('should extract correctly', () => {
        const author = 'Telegram';
        const message = '[Дмитрий Захарченко] : Как сделать зачоркнутый текст в гугл доках?';
        const date = new Date();
        const hub = 'Telegram';

        const extractor = new HubMessageExtractor(hub);
        const result = extractor.extract(new FreeRoEventArgs(author, message, date));
        expect(result).not.toBeNull();
        expect(result.originalMessage).toBe(message);
        expect(result.originalOwner).toBe(author);
        expect(result.date).toBe(date);
        expect(result.message).toBe('Как сделать зачоркнутый текст в гугл доках?');
        expect(result.owner).toBe('Дмитрий Захарченко');
        expect(result.source).toBe(hub);
    });

    it('should extract correctly (ISSUE-1: Dcrd has no : between nick and message)', () => {
        const author = 'Dcrd';
        const message = '[Nao] сделайте в почте тему письма введенной по умолчанию и можно без квеста';
        const date = new Date();
        const hub = 'Dcrd';

        const extractor = new HubMessageExtractor(hub);
        const result = extractor.extract(new FreeRoEventArgs(author, message, date));
        expect(result).not.toBeNull();
        expect(result.originalMessage).toBe(message);
        expect(result.originalOwner).toBe(author);
        expect(result.date).toBe(date);
        expect(result.message).toBe('сделайте в почте тему письма введенной по умолчанию и можно без квеста');
        expect(result.owner).toBe('Nao');
        expect(result.source).toBe(hub);
    });


    it('should extract correctly extra brakets', () => {
        const author = 'Dcrd';
        const message = '[Nao] сделайте [Nao] в почте [Nao] тему письма введенной по умолчанию и можно без квеста';
        const date = new Date();
        const hub = 'Dcrd';

        const extractor = new HubMessageExtractor(hub);
        const result = extractor.extract(new FreeRoEventArgs(author, message, date));
        expect(result).not.toBeNull();
        expect(result.originalMessage).toBe(message);
        expect(result.originalOwner).toBe(author);
        expect(result.date).toBe(date);
        expect(result.owner).toBe('Nao');
        expect(result.message).toBe('сделайте [Nao] в почте [Nao] тему письма введенной по умолчанию и можно без квеста');
        expect(result.source).toBe(hub);
    });


    it('incorrect messages should be empty', () => {
        const author = 'Telegram';
        const message = 'Как сделать зачоркнутый текст в гугл доках?';
        const date = new Date();
        const hub = 'Telegram';

        const extractor = new HubMessageExtractor(hub);
        const result = extractor.extract(new FreeRoEventArgs(author, message, date));
        expect(result).not.toBeNull();
        expect(result.originalMessage).toBe(message);
        expect(result.originalOwner).toBe(author);
        expect(result.date).toBe(date);
        expect(result.message).toBe('');
        expect(result.owner).toBe('');
        expect(result.source).toBe(hub);
    });
});