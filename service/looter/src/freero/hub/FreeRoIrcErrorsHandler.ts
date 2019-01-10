import {Client as IrcClient} from "irc";
import {IIrcConnection} from "./base/IIrcConnection";
import {ILogger} from 'my-core';
import FreeRoIrcMessageHandlerBase from './base/FreeRoIrcMessageHandlerBase';
import {FreeRoEventArgs} from './FreeRoEventArgs';

class FreeRoIrcErrorsHandler extends FreeRoIrcMessageHandlerBase {
    constructor(irc: IrcClient | IIrcConnection, logger: ILogger) {
        super(irc, FreeRoIrcMessageHandlerBase.EVENT_ERROR, logger);
    }

    protected ircHandler(error: any) {
        this._logger.log('HANDLE', JSON.stringify(error));

        const freeRoEvent = new FreeRoEventArgs("", error.message, new Date());

        this._onEvent.dispatch(this, freeRoEvent);
    }
}

export default FreeRoIrcErrorsHandler;