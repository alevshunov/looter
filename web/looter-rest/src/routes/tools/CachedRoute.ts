import IRoute from './IRoute';
import {Request, Response} from 'express';
import TimeCachedStore from '../../../../looter-ui/src/core/extra/TimeCachedStore';

class CachedRoute implements IRoute {
    public path: string;
    private _baseRoute: IRoute;


    constructor(baseRoute: IRoute) {
        this._baseRoute = baseRoute;
        this.path = baseRoute.path;
    }

    public execute(request: Request, response: Response) {
        const cachedObject = TimeCachedStore.instance().get(request.url);
        if (cachedObject) {
            return cachedObject;
        }

        const data = this._baseRoute.execute(request, response);
        TimeCachedStore.instance().set(request.url, data);
        return data;
    }

}

export default CachedRoute;
