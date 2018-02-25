import {SellExtractor} from "./SellExtractor";
import {FreeRoEventArgs} from "../hub/FreeRoEventArgs";
import {Shop, ShopType} from "../../model/Shop";

describe('SellExtractor', () => {
    it('should be applicable and correct for correct server message', () => {
        const author = 'FreeRO';
        const msg = "#main : [Server] 'Фридрих фон Хайек' открывает магазин '+8 Dex, +6 Int, AD/FP Bottles' (коорд.: alberta_dun01 <128,53>).";
        const date = new Date();

        const extractor = new SellExtractor();
        const args = new FreeRoEventArgs(author, msg, date);

        const result = extractor.applicable(args);

        expect(result).toBeTruthy();

        const shop = extractor.extract(args);

        expect(shop).not.toBeNull();
        expect(shop).toBeInstanceOf(Shop);
        expect(shop.owner).toBe('Фридрих фон Хайек');
        expect(shop.name).toBe('+8 Dex, +6 Int, AD/FP Bottles');
        expect(shop.location).toBe('alberta_dun01 <128,53>');
        expect(shop.date).toBe(date);
        expect(shop.type).toBe(ShopType.Sell);
    });

    it('should be not applicable for non server message', () => {
        const author = 'FreeRO2';
        const msg = "#main : [Server] 'Фридрих фон Хайек' открывает магазин '+8 Dex, +6 Int, AD/FP Bottles' (коорд.: alberta_dun01 <128,53>).";
        const date = new Date();

        const extractor = new SellExtractor();
        const args = new FreeRoEventArgs(author, msg, date);

        const result = extractor.applicable(args);

        expect(result).toBeFalsy();
    });

    it('should be not applicable for server non shop message', () => {
        const author = 'FreeRO2';
        const msg = "#main : [Server] 'Фридрих фон Хайек' открывает cregre '+8 Dex, +6 Int, AD/FP Bottles' (коорд.: alberta_dun01 <128,53>).";
        const date = new Date();

        const extractor = new SellExtractor();
        const args = new FreeRoEventArgs(author, msg, date);

        const result = extractor.applicable(args);

        expect(result).toBeFalsy();
    });

});