import {IEvent} from "strongly-typed-events";

export interface IEventProvider<T> {
    onEvent(): IEvent<IEventProvider<T>, T>;
}

export interface ISwitchEventProvider<TA, TB> extends IEventProvider<TA>{
    onEvent(): IEvent<IEventProvider<TA>, TA>;
    onIgnoredEvent(): IEvent<IEventProvider<TA>, TB>;
}