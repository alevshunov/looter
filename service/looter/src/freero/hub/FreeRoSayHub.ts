import {IIrcConnection} from './base/IIrcConnection';
import {MyLogger} from '../../../../../local_modules/my-core';

interface ISayHub {
    say(to: string, message: string) : void
}

class FreeRoSayHub implements ISayHub {
    private _irc: IIrcConnection;
    private _logger: MyLogger;

    constructor(irc: IIrcConnection, logger: MyLogger) {
        this._irc = irc;
        this._logger = logger;
    }

    public say(to: string, message: string) : void {
        this._logger.log(`SAY TO ${to}: ${message}.`);
        this._irc.say(to, message);
    }
}

export {ISayHub, FreeRoSayHub};