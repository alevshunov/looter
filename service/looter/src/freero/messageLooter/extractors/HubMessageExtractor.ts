import {Message} from "../../../model/Message";
import {IMessageExtractor} from "./IMessageExtractor";
import {FreeRoEventArgs} from "../../hub/FreeRoEventArgs";

export class HubMessageExtractor implements IMessageExtractor {
    readonly hub: string;

    constructor(hub: string) {
        this.hub = hub;
    }

    public extract(args: FreeRoEventArgs): Message {
        const parts = /^\[(.+?)\] :? ?(.+)$/g.exec(args.message);

        if (!parts || parts.length < 2) {
            return new Message('', '', args.date, this.hub, args.author, args.message);
        }

        const realOwner = parts[1];
        const realMessage = parts[2];

        return new Message(realOwner, realMessage, args.date, this.hub, args.author, args.message);
    }
}