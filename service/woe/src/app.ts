import { MyConnection, MyLogger } from 'my-core';
import ForumRawStatisticLoader from './ForumRawStatisticLoader';
import RawStatisticParser from './RawStatisticParser';
import StatisticSaver from './StatisticSaver';
import WoESaver from './WoESaver';
import PlayerSaverFactory from './PlayerSaverFactory';
import WoEAttributeLoaderFactory from './WoEAttributeLoaderFactory';
import PlayerAttributeSaverFactory from './PlayerAttributeSaverFactory';
import WoEAttributeSaverFactory from './WoEAttributeSaverFactory';
import ForumStatisticWatcher from './ForumStatisticWatcher';
import WoEExistChecker from './WoEExistChecker';
import RateAndIndexRecalculator from './indexes/RateAndIndexRecalculator';
import IconSaver from './IconSaver';
import GuildSaverFactory from './GuildSaverFactory';
import PlayerOnWoESaverFactory from './PlayerOnWoESaverFactory';

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

    const threads = await new ForumStatisticWatcher().load();

    let hasChanges = false;

    for (let i=0; i<threads.length; i++) {
        const postId = threads[i].id;
        const name = threads[i].name;
        const date = threads[i].date;

        if (await new WoEExistChecker(name, date, connection).isExist()) {
            logger.log(`${name} already parsed.`);
            continue;
        }

        const woeId = await new WoESaver(name, date, postId, connection).save();

        const { stat, icons } = await new ForumRawStatisticLoader(postId).load();
        const parsedStatistic = new RawStatisticParser(stat, icons).parse();

        await new StatisticSaver(
            woeId,
            parsedStatistic,
            logger,
            new PlayerSaverFactory(connection),
            new WoEAttributeLoaderFactory(connection),
            new PlayerAttributeSaverFactory(connection),
            new WoEAttributeSaverFactory(connection),
            new GuildSaverFactory(connection),
            new PlayerOnWoESaverFactory(connection)
        ).save();

        hasChanges = true;
    }

    if (hasChanges) {
        await new RateAndIndexRecalculator(connection).recalculate();
    }

    await connection.close();

    logger.log('Done');
})();

logger.log('Starting...');
logger.log('Using ', process.env.LOOTER_DB_DBNAME);
