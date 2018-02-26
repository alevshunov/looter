import {EventDispatcher, IEvent} from "strongly-typed-events";
import {Client as IrcClient} from "irc";
import {FreeRoEventArgs} from "./FreeRoEventArgs";
import {IEventProvider} from "../../core/IEventProvider";
import {IIrcConnection} from "./IIrcConnection";
import {MyLogger} from '../../core/MyLogger';

export class FreeRoIrcHub implements IEventProvider<FreeRoEventArgs> {
    private _irc: IrcClient | IIrcConnection;

    private IRC_MESSAGE_DIRECT_EVENT = 'pm';
    private IRC_MESSAGE_EVENT = 'message#freero';
    private IRC_ERROR_EVENT = 'error';

    private _onEvent = new EventDispatcher<FreeRoIrcHub, FreeRoEventArgs>();
    private _logger: MyLogger;

    constructor(irc: IrcClient | IIrcConnection, logger: MyLogger) {
        this._irc = irc;
        this._logger = logger;
        this.init();
    }

    private init() {
        this._irc.addListener(this.IRC_MESSAGE_DIRECT_EVENT, this.ircDirectMessageHandler.bind(this));
        this._irc.addListener(this.IRC_MESSAGE_EVENT, this.ircMessageHandler.bind(this));
        this._irc.addListener(this.IRC_ERROR_EVENT, this.ircErrorHandler.bind(this))
    }

    private ircDirectMessageHandler(from: string, message: string, extra: any) {
        this._logger.log('MSG >> ', from, '>', message);
        this._logger.log('MSG >> ', JSON.stringify(extra));

        const freeRoEvent = new FreeRoEventArgs('FreeRO-PM', message, new Date());

        this._onEvent.dispatch(this, freeRoEvent);
    }

    private ircMessageHandler(from: string, message: string, extra: any) {
        this._logger.log('MSG >> ', from, '>', message);
        this._logger.log('MSG >> ', JSON.stringify(extra));

        const freeRoEvent = new FreeRoEventArgs(from, message, new Date());

        this._onEvent.dispatch(this, freeRoEvent);
    }

    private ircErrorHandler(message: string) {
        this._logger.log(new Date(), 'Error:', message);
        this._irc.connect(10);
    }

    public onEvent(): IEvent<FreeRoIrcHub, FreeRoEventArgs> {
        return this._onEvent.asEvent();
    }
}