import {EventDispatcher, IEvent} from "strongly-typed-events";
import {Client as IrcClient} from "irc";

export namespace Core {
    export class CardDrop {
        cardName: string;
        owner: string;
        date: Date;


        constructor(cardName: string, owner: string, date: Date) {
            this.cardName = cardName;
            this.owner = owner;
            this.date = date;
        }
    }

    export interface ICardLooter {
        onCardDropped(): IEvent<ICardLooter, ICardDroppedEventArgs>;
    }

    export interface ICardDroppedEventArgs {
        drop: CardDrop;
    }

    export interface IExternalEventsExtractor<TEvent, TData> {
        applicable(event: TEvent): boolean;

        extract(event: TEvent): TData;
    }

    export interface IExternalEventsProvider<TEvent> {
        onEvent(): IEvent<IExternalEventsProvider<TEvent>, TEvent>;
    }

    export class CardLooter<TExternalEvent> implements ICardLooter {

        private _ro: IExternalEventsProvider<TExternalEvent>;
        private _onCardDroppedEvent = new EventDispatcher<ICardLooter, ICardDroppedEventArgs>();
        private _cardInfoExtractor: IExternalEventsExtractor<TExternalEvent, any>;

        constructor(ro: IExternalEventsProvider<TExternalEvent>, cardInfoExtractor: IExternalEventsExtractor<TExternalEvent, any>) {
            this._ro = ro;
            this._cardInfoExtractor = cardInfoExtractor;
            this._ro.onEvent().subscribe((sender, event) => this.onNewEvent(sender, event))
        }

        onCardDropped(): IEvent<ICardLooter, ICardDroppedEventArgs> {
            return this._onCardDroppedEvent.asEvent();
        }

        private onNewEvent(sender: IExternalEventsProvider<TExternalEvent>, event: TExternalEvent) {
            if (!this._cardInfoExtractor.applicable(event)) {
                return;
            }

            const drop = this._cardInfoExtractor.extract(event);

            this._onCardDroppedEvent.dispatch(this, new CardDroppedEventArgs(drop));
        }
    }

    export class CardDroppedEventArgs implements ICardDroppedEventArgs {
        drop: Core.CardDrop;

        constructor(drop: Core.CardDrop) {
            this.drop = drop;
        }
    }
}