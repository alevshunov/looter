import {Client as IrcClient} from "irc";
import {IIrcConnection} from "./base/IIrcConnection";
import {MyLogger} from 'my-core';
import FreeRoIrcMessageHandlerBase from './base/FreeRoIrcMessageHandlerBase';

class FreeRoIrcPmHandler extends FreeRoIrcMessageHandlerBase {
    constructor(irc: IrcClient | IIrcConnection, logger: MyLogger) {
        super(irc, FreeRoIrcMessageHandlerBase.EVENT_DIRECT_MESSAGE, logger);
    }
}

export default FreeRoIrcPmHandler;