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


const dbConnection = {
    host: process.env.LOOTER_DB_HOST,
    user: process.env.LOOTER_DB_USER,
    password: process.env.LOOTER_DB_PASSWORD,
    database: process.env.LOOTER_DB_DBNAME
};

(async function() {
    const logger = new MyLogger();
    const connection = new MyConnection(dbConnection, logger);

    await connection.open();

    const items = await new ForumStatisticWatcher().load();

    const threads = items.map(x => { return {id: x.id, name: x.date}});


    for (let i=0; i<threads.length; i++) {
        const threadId = threads[i].id;
        const name = threads[i].name;

        const stat = await new ForumRawStatisticLoader(threadId).load();
        const parsedStatistic = new RawStatisticParser(stat).parse();


        const woeId = await new WoESaver(name, connection).save();
        await new StatisticSaver(
            woeId,
            parsedStatistic,
            new PlayerSaverFactory(connection),
            new WoEAttributeLoaderFactory(connection),
            new PlayerAttributeSaverFactory(connection),
            new WoEAttributeSaverFactory(connection)
        ).save();

    }
    await connection.close();
})();

console.log('hello world!');
