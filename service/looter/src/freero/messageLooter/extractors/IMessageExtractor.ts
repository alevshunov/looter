import {Message} from "../../../model/Message";
import {FreeRoEventArgs} from "../../hub/FreeRoEventArgs";

export interface IMessageExtractor {
    hub: string;

    extract(args: FreeRoEventArgs): Message;
}