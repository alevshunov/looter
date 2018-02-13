import {FreeRoEventArgs} from "../hub/FreeRoEventArgs";
import {Message} from "./Message";
import {ExternalEventExtractor} from "../../core/ExternalEventExtractor";
import {IEventProvider} from "../../core/IEventProvider";
import {MessageExtractor} from "./MessageExtractor";
import {ExtractorProvider} from "./extractors/ExtractorProvider";

export class MessageLooter extends ExternalEventExtractor<FreeRoEventArgs, Message> {

    constructor(eventSource: IEventProvider<FreeRoEventArgs>) {
        super(eventSource, new MessageExtractor(new ExtractorProvider()));
    }
}