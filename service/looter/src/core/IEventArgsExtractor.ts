export interface IEventArgsExtractor<TExternalEvent, TInternalEventArgs> {
    applicable(event: TExternalEvent) : boolean;

    extract(event: TExternalEvent) : TInternalEventArgs;
}