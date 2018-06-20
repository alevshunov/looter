import DealsHistoryExtractor from './core/DealsHistoryExtractor';
import {MyConnection, MyLogger} from 'my-core/index';


const dbConnection = {
    host: process.env.LOOTER_DB_HOST,
    user: process.env.LOOTER_DB_USER,
    password: process.env.LOOTER_DB_PASSWORD,
    database: process.env.LOOTER_DB_DBNAME
};

const logger = new MyLogger();

(async function() {
    const connection = new MyConnection(dbConnection, logger);

    await connection.open();
    await new DealsHistoryExtractor(connection).extract();
    await connection.close();

    logger.log(`Done.`);
})();

logger.log(`Started...`);