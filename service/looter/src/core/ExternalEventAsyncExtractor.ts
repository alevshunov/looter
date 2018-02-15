import {EventDispatcher, IEvent} from "strongly-typed-events";
import {IEventProvider, ISwitchEventProvider} from "./IEventProvider";
import {IEventArgsAsyncExtractor} from "./IEventArgsExtractor";

export class ExternalEventAsyncExtractor<TExternalEventArgs, TInternalEventArgs> implements ISwitchEventProvider<TInternalEventArgs, TExternalEventArgs> {
    protected _eventSource: IEventProvider<TExternalEventArgs>;
    protected _argsExtractor: IEventArgsAsyncExtractor<TExternalEventArgs, TInternalEventArgs>;
    protected _internalEventDispatcher = new EventDispatcher<IEventProvider<TInternalEventArgs>, TInternalEventArgs>();
    protected _ignoredEventDispatcher = new EventDispatcher<IEventProvider<TInternalEventArgs>, TExternalEventArgs>();

    constructor(eventSource: IEventProvider<TExternalEventArgs>,
                argsExtractor: IEventArgsAsyncExtractor<TExternalEventArgs, TInternalEventArgs>
    ) {
        this._eventSource = eventSource;
        this._argsExtractor = argsExtractor;

        this._eventSource.onEvent().subscribe(this.externalEventHandler.bind(this));
    }

    protected async externalEventHandler(sender: IEventProvider<TExternalEventArgs>, args: TExternalEventArgs) {
        const applicable = await this._argsExtractor.applicable(args);

        if (!applicable) {
            return this._ignoredEventDispatcher.dispatch(this, args);
        }

        const internalArgs : TInternalEventArgs = await this._argsExtractor.extract(args);

        return this._internalEventDispatcher.dispatch(this, internalArgs);
    }

    public onEvent(): IEvent<IEventProvider<TInternalEventArgs>, TInternalEventArgs> {
        return this._internalEventDispatcher.asEvent();
    }

    public onIgnoredEvent(): IEvent<IEventProvider<TInternalEventArgs>, TExternalEventArgs> {
        return this._ignoredEventDispatcher.asEvent();
    }
}