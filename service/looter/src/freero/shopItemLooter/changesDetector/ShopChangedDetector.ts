import {ShopItem} from "../../../model/ShopItem";

export class ShopChangedDetector {
    private _parent: ShopItem[];
    private _current: ShopItem[];

    constructor(parent: ShopItem[], current: ShopItem[]) {
        this._parent = parent;
        this._current = current;
    }

    public isChanged(): boolean {
        if (this._parent.length != this._current.length) {
            return true;
        }

        for (let i=0; i<this._parent.length; i++) {
            const parentItem = this._parent[i];
            const currentItem = this._current[i];

            if (parentItem.name !== currentItem.name ||
                parentItem.count !== currentItem.count ||
                parentItem.price !== currentItem.price) {
                return true;
            }
        }

        return false;
    }
}