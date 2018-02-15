import {FreeRoEventArgs} from "../hub/FreeRoEventArgs";
import {IEventProvider} from "../../core/IEventProvider";
import {Shop} from "../../model/Shop";
import {ShopExtractor} from "./ShopExtractor";
import {ExternalEventExtractor} from "../../core/ExternalEventExtractor";

export class ShopLooter extends ExternalEventExtractor<FreeRoEventArgs, Shop> {
    constructor(eventSource: IEventProvider<FreeRoEventArgs>) {
        super(eventSource, new ShopExtractor());
    }
}