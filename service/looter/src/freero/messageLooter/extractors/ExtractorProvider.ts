import {IMessageExtractor} from "./IMessageExtractor";
import {DirectMessageExtractor} from "./DirectMessageExtractor";
import {HubMessageExtractor} from "./HubMessageExtractor";

export interface IExtractorProvider {
    lookup(sender: string) : IMessageExtractor;
}

export class ExtractorProvider implements IExtractorProvider {
    private hubs: {};

    constructor() {
        this.hubs = {
            'FreeRO' : new HubMessageExtractor('FreeRO'),
            'Dcrd' : new HubMessageExtractor('Dcrd'),
            'Telegram' : new HubMessageExtractor('Telegram'),
            '*': new DirectMessageExtractor('IRC')
        };
    }

    public lookup(sender: string) : IMessageExtractor {
        return this.hubs[sender] || this.hubs['*'];
    }
}