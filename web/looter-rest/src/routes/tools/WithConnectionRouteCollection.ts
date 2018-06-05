import WithConnectionRoute from './WithConnectionRoute';
import {MyLogger} from 'my-core';
import IRouteWithConnection from './IRouteWithConnection';
import IRoute from './IRoute';

class WithConnectionRouteCollection {
    private _items : IRoute[] = [];
    private _logger: MyLogger;
    private _db: {};


    constructor(logger: MyLogger, db: {}) {
        this._logger = logger;
        this._db = db;
    }

    add(item: IRouteWithConnection) {
        if (item.path === '') {
            throw `${item.constructor.name} is not registered. Path can not be empty.`;
        }

        if (this._items.find(x => x.path === item.path)) {
            throw `${item.constructor.name} is not registered. Path "${item.path}" is already in use.`;
        }

        this._items.push(new WithConnectionRoute(item, this._logger, this._db));
        return this;
    }

    wrapWith(fn: (route: IRoute) => IRoute) {
        this._items = this._items.map(fn);
        return this;
    }

    all() : IRoute[] {
        return this._items;
    }
}

export default WithConnectionRouteCollection;
