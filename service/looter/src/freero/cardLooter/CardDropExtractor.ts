import {CardDrop} from "../../model/CardDrop";
import {FreeRoEventArgs} from "../hub/FreeRoEventArgs";
import {IEventArgsExtractor} from "../../core/IEventArgsExtractor";

export class CardDropExtractor implements IEventArgsExtractor<FreeRoEventArgs, CardDrop>{
    private SERVER: string = 'FreeRO';
    private CARD_EXP: RegExp = /^#main : \[Server\] '(.+)'.*'(.+)'. Грац!$/;

    public applicable(args: FreeRoEventArgs): boolean {
        let result = true;

        if (args.author !== this.SERVER) {
            result = false;
        }

        if (!new RegExp(this.CARD_EXP).test(args.message)) {
            result = false;
        }

        return result;
    }

    public extract(args: FreeRoEventArgs): CardDrop {
        const parts = new RegExp(this.CARD_EXP).exec(args.message);

        const owner = parts[1];
        const card = parts[2];

        return new CardDrop(card, owner, args.date);
    }
}