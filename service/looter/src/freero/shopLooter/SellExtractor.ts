import {FreeRoEventArgs} from "../hub/FreeRoEventArgs";
import {Shop, ShopType} from "../../model/Shop";
import {IEventArgsExtractor} from "../../core/IEventArgsExtractor";

export class SellExtractor implements IEventArgsExtractor<FreeRoEventArgs, Shop> {
    private SHOP_EXP : RegExp = /^#main \: \[Server\] '(.+?)' открывает магазин '(.+?)' \(коорд\.\: (.+ <[0-9]+,[0-9]+>)\)\.$/;
    private SERVER: string = 'FreeRO';

    applicable(args: FreeRoEventArgs): boolean {
        //#main : [Server] 'Фридрих фон Хайек' открывает магазин '+8 Dex, +6 Int, AD/FP Bottles' (коорд.: alberta <128,53>).

        let result = true;

        if (args.author !== this.SERVER) {
            result = false;
        }

        if (!new RegExp(this.SHOP_EXP).test(args.message)) {
            result = false;
        }

        return result;
    }

    extract(args: FreeRoEventArgs): Shop {
        const parts = new RegExp(this.SHOP_EXP).exec(args.message);

        const owner = parts[1];
        const name = parts[2];
        const location = parts[3];

        return new Shop(owner, name, location, args.date, ShopType.Sell);
    }

}