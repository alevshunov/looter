import IRouteWithConnection from './IRouteWithConnection';
import {Request} from 'express';
import {MyConnection, ILogger} from 'my-core';
import IRoute from './IRoute';


class WithConnectionRoute implements IRoute {
    public path = '';
    private _baseRoute: IRouteWithConnection;
    private _logger: ILogger;
    private _db: {};

    constructor(baseRoute: IRouteWithConnection, logger: ILogger, db: {}) {
        this._baseRoute = baseRoute;
        this._logger = logger;
        this._db = db;
        this.path = baseRoute.path;
    }

    public async execute(request: Request): Promise<any> {
        const connection = await new MyConnection(this._db, this._logger).open();

        const data = await this._baseRoute.execute(connection, request);

        connection.close();

        return data;
    }

}

export default WithConnectionRoute;