import {EventDispatcher, IEvent} from "strongly-typed-events";
import {Client as IrcClient} from "irc";
import {FreeRoEventArgs} from "../FreeRoEventArgs";
import {IEventProvider} from "../../../core/IEventProvider";
import {IIrcConnection} from "./IIrcConnection";
import {MyLogger} from 'my-core';

class FreeRoIrcMessageHandlerBase implements IEventProvider<FreeRoEventArgs> {
    static EVENT_DIRECT_MESSAGE : string = 'pm';
    static EVENT_MESSAGE : string = 'message#freero';
    static EVENT_ERROR : string = 'error';

    protected _irc: IrcClient | IIrcConnection;

    protected _onEvent = new EventDispatcher<FreeRoIrcMessageHandlerBase, FreeRoEventArgs>();
    protected _logger: MyLogger;
    protected _handler: string;

    constructor(irc: IrcClient | IIrcConnection, handler: string, logger: MyLogger) {
        this._irc = irc;
        this._logger = logger;
        this._handler = handler;
        this.init();
    }

    private init() {
        this._irc.addListener(this._handler, this.ircHandler.bind(this));
    }

    protected ircHandler(from: string, message: string, extra: any) {
        this._logger.log('HANDLE', from, '>', message);

        const freeRoEvent = new FreeRoEventArgs(from, message, new Date());

        this._onEvent.dispatch(this, freeRoEvent);
    }

    public onEvent(): IEvent<FreeRoIrcMessageHandlerBase, FreeRoEventArgs> {
        return this._onEvent.asEvent();
    }
}

export default FreeRoIrcMessageHandlerBase;