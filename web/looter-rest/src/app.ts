import * as express from 'express';
import { MyConnection, MyLogger } from 'my-core';
import CardsRoute from './routes/CardsRoute';
import ReportRoute from './routes/ReportRoute';
import ReportPreviewRoute from './routes/ReportPreviewRoute';
import ShopsActiveRoute from './routes/ShopsActiveRoute';
import ShopsAllRoute from './routes/ShopsAllRoute';
import ShopsWithRoute from './routes/ShopsWithRoute';
import ShopsByOwnerRoute from './routes/ShopsByOwnerRoute';
import ShopByIdRoute from './routes/ShopByIdRoute';
import RoutesRegister from './tools/RoutesRegister';
import WithConnectionRouteCollection from './routes/tools/WithConnectionRouteCollection';
import ItemPriceRoute from './routes/ItemPriceRoute';
import WoEGuildByIdRoute from './routes/WoEGuildByIdRoute';
import WoEGuildsRoute from './routes/WoEGuildsRoute';
import WoEHistoryRoute from './routes/WoEHistoryRoute';
import WoEInfoByIdRoute from './routes/WoEInfoByIdRoute';
import WoEPlayerByNameRoute from './routes/WoEPlayerByNameRoute';
import WoEPlayersRoute from './routes/WoEPlayersRoute';
import TimedRoute from './routes/tools/TimedRoute';
import CachedRoute from './routes/tools/CachedRoute';
import WoECastles from './routes/WoECastles';
import BasedOnWoeCacheRoute from './routes/tools/BasedOnWoeCacheRoute';
import DealsRoute from './routes/DealsRoute';
import DealsByItemRoute from './routes/DealsByItemRoute';

const app = express();
const router = express.Router();
const logger = new MyLogger();

const db = {
    host: process.env.LOOTER_DB_HOST,
    user: process.env.LOOTER_DB_USER,
    password: process.env.LOOTER_DB_PASSWORD,
    database: process.env.LOOTER_DB_DBNAME
};

new RoutesRegister(logger, db, router)
    .register(
        new WithConnectionRouteCollection(logger, db)
            .add(new CardsRoute())
            .add(new ItemPriceRoute())
            .add(new ReportPreviewRoute())
            .add(new ReportRoute())
            .add(new ShopByIdRoute())
            .add(new ShopsActiveRoute())
            .add(new ShopsAllRoute())
            .add(new ShopsByOwnerRoute())
            .add(new ShopsWithRoute())
            .add(new DealsRoute())
            .add(new DealsByItemRoute())
            .add(new BasedOnWoeCacheRoute(new WoEGuildByIdRoute(), logger))
            .add(new BasedOnWoeCacheRoute(new WoEGuildsRoute(), logger))
            .add(new BasedOnWoeCacheRoute(new WoEHistoryRoute(), logger))
            .add(new BasedOnWoeCacheRoute(new WoEInfoByIdRoute(), logger))
            .add(new BasedOnWoeCacheRoute(new WoEPlayerByNameRoute(), logger))
            .add(new BasedOnWoeCacheRoute(new WoEPlayersRoute(), logger))
            .add(new BasedOnWoeCacheRoute(new WoECastles(), logger))
            .wrapWith(x => new CachedRoute(x))
            .wrapWith(x => new TimedRoute(x, logger))
            .all()
    );



app.use(async (req, res, next) => {
    logger.log(req.headers["x-real-ip"], req.originalUrl || req.url || req.path || '');

    if (process.env.LOOTER_DEV === 'true') {
        res.setHeader('Access-Control-Allow-Origin', '*');
    } else {
        const connection = await new MyConnection(db, logger).open();
        await connection.query(`insert into logs(date, type, ip, url) values(?, ?, ?, ?);`,
            new Date(), 'rest', req.headers["x-real-ip"] || '', req.originalUrl || req.url || req.path || '');
        connection.close();
    }
    next();
});

app.use('/rest', router);

if (!process.env.LOOTER_REST_PORT) {
    throw 'LOOTER_REST_PORT is required';
}

app.listen(process.env.LOOTER_REST_PORT);
logger.log('looter-rest started, port: ' + process.env.LOOTER_REST_PORT);