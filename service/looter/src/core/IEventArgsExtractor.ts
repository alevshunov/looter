export interface IEventArgsExtractor<TExternalEvent, TInternalEventArgs> {
    applicable(args: TExternalEvent) : boolean;

    extract(args: TExternalEvent) : TInternalEventArgs;
}

export interface IEventArgsAsyncExtractor<TExternalEvent, TInternalEventArgs> {
    applicable(args: TExternalEvent) : Promise<boolean>;

    extract(args: TExternalEvent) : Promise<TInternalEventArgs>;
}