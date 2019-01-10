import {Client as IrcClient} from "irc";
import {IIrcConnection} from "./base/IIrcConnection";
import {ILogger} from 'my-core';
import FreeRoIrcMessageHandlerBase from './base/FreeRoIrcMessageHandlerBase';

class FreeRoIrcMessageHandler extends FreeRoIrcMessageHandlerBase {
    constructor(irc: IrcClient | IIrcConnection, logger: ILogger) {
        super(irc, FreeRoIrcMessageHandlerBase.EVENT_MESSAGE, logger);
    }
}

export default FreeRoIrcMessageHandler;