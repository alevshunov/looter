import IRoute from './IRoute';
import {Request, Response} from 'express';
import {MyLogger} from 'my-core';

class TimedRoute implements IRoute {
    public path: string;
    private _logger: MyLogger;
    private _baseRoute: IRoute;

    constructor(baseRoute: IRoute, logger: MyLogger) {
        this._logger = logger;
        this.path = baseRoute.path;
        this._baseRoute = baseRoute;
    }

    public async execute(request: Request, response: Response): Promise<any> {
        const start = Date.now();
        const data = await this._baseRoute.execute(request, response);
        const elapsed = Date.now() - start;

        this._logger.log(`Route "${this.path}" as "${request.url}" executed in ${elapsed} ms.`);

        return data;
    }
}

export default TimedRoute;
