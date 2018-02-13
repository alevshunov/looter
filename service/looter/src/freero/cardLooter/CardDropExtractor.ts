import {CardDrop} from "./CardDrop";
import {FreeRoEventArgs} from "../hub/FreeRoEventArgs";
import {IEventArgsExtractor} from "../../core/IEventArgsExtractor";

export class CardDropExtractor implements IEventArgsExtractor<FreeRoEventArgs, CardDrop>{
    private SERVER: string = 'FreeRO';
    // private CARD_EXP: RegExp = /#main : \[Server\] '(.+)'.*'(.+)'. Грац!/g;

    public applicable(args: FreeRoEventArgs): boolean {
        let result = true;

        if (args.author !== this.SERVER) {
            result = false;
        }

        if (!/#main : \[Server\] '(.+?)'.*'(.+?)'. Грац!/g.test(args.message)) {
            result = false;
        }

        return result;
    }

    public extract(args: FreeRoEventArgs): CardDrop {
        const parts = /#main : \[Server\] '(.+?)'.*'(.+?)'. Грац!/g.exec(args.message);

        const owner = parts[1];
        const card = parts[2];

        return new CardDrop(card, owner, args.date);
    }
}