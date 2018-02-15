import {Message} from "../../model/Message";
import {IMessageExtractor} from "./extractors/IMessageExtractor";
import {IEventArgsExtractor} from "../../core/IEventArgsExtractor";
import {FreeRoEventArgs} from "../hub/FreeRoEventArgs";
import {IExtractorProvider} from "./extractors/ExtractorProvider";

export class MessageExtractor implements IEventArgsExtractor<FreeRoEventArgs, Message> {
    private _extractorProvider: IExtractorProvider;

    constructor(realExtractor: IExtractorProvider) {
        this._extractorProvider = realExtractor;
    }

    public applicable(args: FreeRoEventArgs): boolean {
        return true;
    }

    public extract(args: FreeRoEventArgs): Message {
        const extractor: IMessageExtractor = this._extractorProvider.lookup(args.author);
        return extractor.extract(args);
    }
}