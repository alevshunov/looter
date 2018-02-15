import {Message} from "../../../model/Message";
import {IMessageExtractor} from "./IMessageExtractor";
import {FreeRoEventArgs} from "../../hub/FreeRoEventArgs";

export class DirectMessageExtractor implements IMessageExtractor  {
    readonly hub: string;

    constructor(hub: string) {
        this.hub = hub;
    }

    public extract(args: FreeRoEventArgs): Message {
        return new Message(args.author, args.message, args.date, this.hub, args.author, args.message);
    }
}