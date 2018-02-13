import {IMessageExtractor} from "./IMessageExtractor";
import {DirectMessageExtractor} from "./DirectMessageExtractor";
import {HubMessageExtractor} from "./HubMessageExtractor";
import {Map} from "gulp-typescript/release/utils";

export interface IExtractorProvider {
    lookup(sender: string) : IMessageExtractor;
}

export class ExtractorProvider implements IExtractorProvider {
    private hubs: Map<IMessageExtractor>;

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