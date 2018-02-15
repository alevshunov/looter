import {EventDispatcher, IEvent} from "strongly-typed-events";
import {IEventProvider} from "./IEventProvider";
import {IEventArgsExtractor} from "./IEventArgsExtractor";

export class ExternalEventExtractor<TExternalEventArgs, TInternalEventArgs> implements IEventProvider<TInternalEventArgs> {
    protected _eventSource: IEventProvider<TExternalEventArgs>;
    protected _argsExtractor: IEventArgsExtractor<TExternalEventArgs, TInternalEventArgs>;
    protected _eventDispatcher = new EventDispatcher<IEventProvider<TInternalEventArgs>, TInternalEventArgs>();

    constructor(eventSource: IEventProvider<TExternalEventArgs>,
                argsExtractor: IEventArgsExtractor<TExternalEventArgs, TInternalEventArgs>
    ) {
        this._eventSource = eventSource;
        this._argsExtractor = argsExtractor;

        this._eventSource.onEvent().subscribe(this.externalEventHandler.bind(this));
    }

    protected externalEventHandler(sender: IEventProvider<TExternalEventArgs>, args: TExternalEventArgs) {
        if (!this._argsExtractor.applicable(args)) {
            return;
        }

        const internalArgs : TInternalEventArgs = this._argsExtractor.extract(args);

        this._eventDispatcher.dispatch(this, internalArgs);
    }

    public onEvent(): IEvent<IEventProvider<TInternalEventArgs>, TInternalEventArgs> {
        return this._eventDispatcher.asEvent();
    }
}