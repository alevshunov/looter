import {ShopChangedDetector} from "./ShopChangedDetector";
import {ShopItem} from "../../../model/ShopItem";
import {ILogger} from "my-core";

interface IShopChangedDetectorProvider {
    createFor(parent: ShopItem[], current: ShopItem[]): ShopChangedDetector;
}

class ShopChangedDetectorProvider implements IShopChangedDetectorProvider {
    private _logger: ILogger;

    constructor(logger: ILogger) {
        this._logger = logger;
    }

    createFor(parent: ShopItem[], current: ShopItem[]): ShopChangedDetector {
        return new ShopChangedDetector(parent, current);
    }
}

export {IShopChangedDetectorProvider, ShopChangedDetectorProvider};