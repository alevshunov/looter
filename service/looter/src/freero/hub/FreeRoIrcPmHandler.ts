import {Client as IrcClient} from "irc";
import {IIrcConnection} from "./IIrcConnection";
import {MyLogger} from 'my-core';
import FreeRoIrcMessageHandlerBase from './FreeRoIrcMessageHandlerBase';

class FreeRoIrcPmHandler extends FreeRoIrcMessageHandlerBase {
    constructor(irc: IrcClient | IIrcConnection, logger: MyLogger) {
        super(irc, 'pm', logger);
    }
}

export default FreeRoIrcPmHandler;