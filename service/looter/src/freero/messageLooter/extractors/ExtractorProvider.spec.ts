import {ExtractorProvider} from "./ExtractorProvider";
import {HubMessageExtractor} from "./HubMessageExtractor";
import {DirectMessageExtractor} from "./DirectMessageExtractor";

describe('ExtractorProvider', () => {
    const provider = new ExtractorProvider();

    it('should return HubMessageExtractor(FreeRO) for FreeRO sender', () => {
        const realProvider = provider.lookup('FreeRO');
        expect(realProvider).toBeInstanceOf(HubMessageExtractor);
        expect(realProvider.hub).toBe('FreeRO');
    });

    it('should return HubMessageExtractor(Telegram) for Telegram sender', () => {
        const realProvider = provider.lookup('Telegram');
        expect(realProvider).toBeInstanceOf(HubMessageExtractor);
        expect(realProvider.hub).toBe('Telegram');
    });

    it('should return HubMessageExtractor(Dcrd) for Dcrd sender', () => {
        const realProvider = provider.lookup('Dcrd');
        expect(realProvider).toBeInstanceOf(HubMessageExtractor);
        expect(realProvider.hub).toBe('Dcrd');
    });

    it('should return DirectMessageExtractor(IRC) for other', () => {
        const realProvider = provider.lookup('X');
        expect(realProvider).toBeInstanceOf(DirectMessageExtractor);
        expect(realProvider.hub).toBe('IRC');
    });
});