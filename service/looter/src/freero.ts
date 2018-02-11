/// <reference path="./core.ts" />

import {EventDispatcher, IEvent} from "strongly-typed-events";
import {Client as IrcClient} from "irc";
import {Core} from "./core";

export namespace FreeRo {
    import IExternalEventsProvider = Core.IExternalEventsProvider;
    import IExternalEventsExtractor = Core.IExternalEventsExtractor;
    import CardLooter = Core.CardLooter;

    export interface IFreeRoEvent {
        author: string;
        date: Date;
        message: string;
    }

    export class FreeRoCardLooter extends CardLooter<FreeRoEvent> {

    }

    export class FreeRoIrcHub implements IExternalEventsProvider<IFreeRoEvent> {
        private _irc: IrcClient;

        private IRC_MESSAGE_EVENT = 'message';
        private IRC_ERROR_EVENT = 'error';

        private _onEvent = new EventDispatcher<FreeRoIrcHub, IFreeRoEvent>();

        constructor(irc: IrcClient) {
            this._irc = irc;
            this.init();
        }

        private init() {
            this._irc.addListener(this.IRC_MESSAGE_EVENT, this.ircMessageHandler.bind(this))
            this._irc.addListener(this.IRC_ERROR_EVENT, this.ircErrorHandler.bind(this))
        }

        private ircMessageHandler(from: string, to: string, message: string) {
            const freeRoEvent = new FreeRoEvent(from, new Date(), message);

            this._onEvent.dispatch(this, freeRoEvent);
        }

        private ircErrorHandler(message: string) {
            console.log(new Date(), 'Error:', message);
            this._irc.connect(10, () => {});
        }

        public onEvent(): IEvent<FreeRoIrcHub, IFreeRoEvent> {
            return this._onEvent.asEvent();
        }
    }

    export class FreeRoEvent implements  IFreeRoEvent {
        author: string;
        date: Date;
        message: string;

        constructor(author: string, date: Date, message: string) {
            this.author = author;
            this.date = date;
            this.message = message;
        }
    }

    export class FreeRoCardInfoExtractor implements IExternalEventsExtractor<IFreeRoEvent, any> {
        private SERVER: string = 'FreeRO';
        // private CARD_EXP: RegExp = /#main : \[Server\] '(.+)'.*'(.+)'. Грац!/g;

        public applicable(event: FreeRo.IFreeRoEvent): boolean {
            let result = true;

            if (event.author !== this.SERVER) {
                result = false;
            }

            if (!/#main : \[Server\] '(.+)'.*'(.+)'. Грац!/g.test(event.message)) {
                result = false;
            }

            return result;
        }

        public extract(event: FreeRo.IFreeRoEvent): Core.CardDrop {
            const parts = /#main : \[Server\] '(.+)'.*'(.+)'. Грац!/g.exec(event.message);

            const owner = parts[1];
            const cardName = parts[2];

            return new Core.CardDrop(cardName, owner, event.date);
        }

    }
}