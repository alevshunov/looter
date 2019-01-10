import FlaggedCashedRoute from './FlaggedCashedRoute';
import {MyConnection, ILogger} from 'my-core/index';
import IRouteWithConnection from './IRouteWithConnection';

class BasedOnWoeCacheRoute extends FlaggedCashedRoute{
    private lastWoEId: number = 0;


    constructor(baseRoute: IRouteWithConnection, logger: ILogger) {
        super(baseRoute, logger);
    }

    protected async isOutdated(connection: MyConnection): Promise<boolean> {
        const lastWoEId = await connection.query(`select max(id) id from woe where parsed = 1`);
        if (lastWoEId[0].id === this.lastWoEId)
        {
            this.logger.log(`Hit the cache, still ${this.lastWoEId}.`);
            return false;
        } else {
            this.logger.log(`Is outdated current ${this.lastWoEId} found ${lastWoEId[0].id}.`);
            this.lastWoEId = lastWoEId[0].id;
            return true;
        }
    }

}

export default BasedOnWoeCacheRoute;
