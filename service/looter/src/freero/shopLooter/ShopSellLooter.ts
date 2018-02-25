import {FreeRoEventArgs} from "../hub/FreeRoEventArgs";
import {IEventProvider} from "../../core/IEventProvider";
import {Shop} from "../../model/Shop";
import {SellExtractor} from "./SellExtractor";
import {ExternalEventExtractor} from "../../core/ExternalEventExtractor";

export class ShopSellLooter extends ExternalEventExtractor<FreeRoEventArgs, Shop> {
    constructor(eventSource: IEventProvider<FreeRoEventArgs>) {
        super(eventSource, new SellExtractor());
    }
}