import {FreeRoEventArgs} from "../hub/FreeRoEventArgs";
import {CardDrop} from "../../model/CardDrop";
import {CardDropExtractor} from "./CardDropExtractor";
import {ExternalEventExtractor} from "../../core/ExternalEventExtractor";
import {IEventProvider} from "../../core/IEventProvider";

export class CardLooter extends ExternalEventExtractor<FreeRoEventArgs, CardDrop> {

    constructor(eventSource: IEventProvider<FreeRoEventArgs>) {
        super(eventSource, new CardDropExtractor());
    }
}