import IRouteWithConnection from './IRouteWithConnection';
import {Request} from 'express';
import {MyConnection, ILogger} from 'my-core';


abstract class FlaggedCashedRoute implements IRouteWithConnection {
    public path: string;
    private _baseRoute: IRouteWithConnection;
    private _data: any;
    protected logger: ILogger;

    protected constructor(baseRoute: IRouteWithConnection, logger: ILogger) {
        this._baseRoute = baseRoute;
        this.path = baseRoute.path;
        this.logger = logger;
    }

    public async execute(connection: MyConnection, request: Request): Promise<any> {
        const isOutdated = await this.isOutdated(connection);
        if (isOutdated) {
            this.logger.log(`Cache outdated, full clear...`);
            this._data = {};
        }

        if (!this._data[request.url]) {
            this.logger.log(`Cached data not found for ${request.url}, loading...`);
            const data = await this._baseRoute.execute(connection, request);
            this._data[request.url] = data;
        }

        return this._data[request.url];
    }

    protected abstract async isOutdated(connection: MyConnection): Promise<boolean>;
}

export default FlaggedCashedRoute;