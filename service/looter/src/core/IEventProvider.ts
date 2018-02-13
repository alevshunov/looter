import {IEvent} from "strongly-typed-events";

export interface IEventProvider<T> {
    onEvent(): IEvent<IEventProvider<T>, T>;
}