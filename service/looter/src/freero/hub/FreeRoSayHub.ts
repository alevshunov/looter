import {IIrcConnection} from './base/IIrcConnection';
import {ILogger} from 'my-core';

interface ISayHub {
    say(to: string, message: string) : void
}

class FreeRoSayHub implements ISayHub {
    private _irc: IIrcConnection;
    private _logger: ILogger;

    constructor(irc: IIrcConnection, logger: ILogger) {
        this._irc = irc;
        this._logger = logger;
    }

    public say(to: string, message: string) : void {
        this._logger.log(`SAY TO ${to}: ${message}.`);
        this._irc.say(to, message);
    }
}

export {ISayHub, FreeRoSayHub};