import {IEventProvider} from "./IEventProvider";
import {EventDispatcher, IEvent} from "strongly-typed-events";

export class SimpleEvent<T> implements IEventProvider<T> {
    private _e : EventDispatcher<IEventProvider<T>, T> = new EventDispatcher<IEventProvider<T>, T>();

    public do(args: T) {
        this._e.dispatch(this, args);
    }

    onEvent(): IEvent<IEventProvider<T>, T> {
        return this._e.asEvent();
    }
}