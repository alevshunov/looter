import {Router} from 'express';
import {ILogger} from 'my-core';
import IRoute from '../routes/tools/IRoute';

class RoutesRegister {
    private _logger: ILogger;
    private _db: any;
    private _router: Router;

    constructor(logger: ILogger, db: any, router: Router) {
        this._logger = logger;
        this._db = db;
        this._router = router;

    }

    register(items: Array<IRoute>) {
        for(let i=0; i<items.length; i++) {
            this._logger.log('Registering', items[i].path);

            this._router.get(items[i].path, async (req, res, next) => {

                try {
                    const data = await items[i].execute(req, res);
                    res.json(data);
                } catch(e) {
                    this._logger.error(e);
                }

                next();
            });

        }

    }
}

export default RoutesRegister;
