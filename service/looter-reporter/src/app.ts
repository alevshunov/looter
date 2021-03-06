import * as moment from 'moment';
import { MyConnection } from 'my-core';
import { ReportEntry } from 'my-models/Report';
import {MyLogger} from 'my-core/MyLogger';

class ReportGenerator {
    async generate() {
        const dbConnection = {
            host: process.env.LOOTER_DB_HOST,
            user: process.env.LOOTER_DB_USER,
            password: process.env.LOOTER_DB_PASSWORD,
            database: process.env.LOOTER_DB_DBNAME
        };

        const isActive = process.env.LOOTER_ACTIVE_REPORT === 'true';

        const endDate = moment().startOf('day').toDate();
        const startDate = moment(endDate).add({ days: -7}).toDate();

        const logger = new MyLogger();
        const connection = new MyConnection(dbConnection, logger);


        async function doReport(connection: MyConnection, start: Date, end: Date) {
            await connection.open();
            const report = new ReportEntry();

            report.reportInfo = {date: new Date(), start: start, end: end};

            const limit = 10;

            function createZeroArray(len: number) {
                const a = new Array(len);
                for (let i = 0; i < len; i++) {
                    a[i] = 0;
                }
                return a;
            }

            async function cardOfAWeek() {

                let data = await connection.query(`
                    select * 
                    from card_drop
                    where date between ? and ?
                    order by rand()
                    limit 1
                `, start, end);

                return data[0].card;
            }

            async function cardDropActivity() {
                let data = await connection.query(`
                    select hour(date) hour, count(*) value
                    from card_drop
                    where date between ? and ?
                    group by hour(date)
                `, start, end);

                const a = createZeroArray(24);

                data.forEach((item: any) => {
                    a[item.hour] = item.value;
                });

                return a;
            }

            async function cardTopPlayer() {
                let data = await connection.query(`
                    select owner, count(*) as count
                    from card_drop
                    where date between ? and ?
                    group by owner
                    order by count desc
                    limit ${limit}
                `, start, end);

                return data;
            }

            async function cardTopDrop() {
                let data = await connection.query(`
                    select card, count(*) as count
                    from card_drop
                    where date between ? and ?
                    group by card
                    order by count desc
                    limit ${limit}
                `, start, end);

                return data;
            }

            async function cardLovelyPlaces() {
                let data = await connection.query(`
                    select owner, card, count(*) count
                    from card_drop
                    where date between ? and ?
                    group by owner, card
                    order by count desc
                    limit ${limit}
                `, start, end);

                return data;
            }

            async function chatStoreOfAWeek() {
                let data = await connection.query(`
                    select owner, message, date
                    from messages
                    where owner != '' and message != '' and owner != 'FreeRO-PM' and length(message) > 60 and date between ? and ?
                    order by rand()
                    limit 1
                `, start, end);

                return data[0];
            }

            async function chatActivity() {
                let data = await connection.query(`
                    select hour(date) hour, count(*) as value
                    from messages
                    where owner != '' and message != '' and owner != 'FreeRO-PM' and date between ? and ?
                    group by hour(date)
                `, start, end);

                const a = createZeroArray(24);

                for (let i = 0; i < data.length; i++) {
                    a[data[i].hour] = data[i].value;
                }

                return a;
            }

            async function chatTopSpeakers() {
                let data = await connection.query(`
                    select t.owner, t.count, 
                    (select message from messages m where t.owner = m.owner and date between ? and ? order by rand() limit 1) randomMessage
                    from
                        (
                            select owner, count(*) count
                            from messages msg
                            where owner != '' and message != '' and owner != 'FreeRO-PM' and date between ? and ? 
                            group by owner
                            order by count desc
                            limit ${limit}
                        ) t
                `, start, end, start, end);

                return data;
            }

            async function chatStoryTellers() {
                let data = await connection.query(`
                    select t.owner, round(t.avgLength) averageLength, 
                        (
                            select message 
                            from messages m 
                            where t.owner = m.owner 
                            and length(message) >= averageLength 
                            and date between ? and ?
                            order by rand() 
                            limit 1
                        ) randomMessage
                    from
                        (
                            select owner, avg(length(message)) avgLength, count(*) as c
                            from messages msg
                            where owner != '' and message != '' and owner != 'FreeRO-PM' and date between ? and ? 
                            group by owner
                            having c > 14
                            order by avgLength desc
                            limit ${limit}
                        ) t
                `, start, end, start, end);

                return data;
            }

            async function shopActivity() {
                let data = await connection.query(`
                    select hour(date) as hour, count(*) as value
                    from shops
                    where date between ? and ?
                    group by hour(date)
                `, start, end);

                const a = createZeroArray(24);

                for (let i = 0; i < data.length; i++) {
                    a[data[i].hour] = data[i].value;
                }

                return a;
            }

            async function shopOfAWeek() {
                let data = await connection.query(`
                    select id, owner, name, location
                    from shops
                    where last_fetch > adddate(date, interval 1 day) and date between ? and ? and type = 'sell'
                    order by rand()
                    limit 1
                `, start, end);

                return data[0];
            }

            async function shopLotOfAWeek() {
                let data = await connection.query(`
                    select s.id, si.name, s.owner, s.name shopName, s.location
                    from shops s inner join shop_items si on s.id = si.shop_id
                    where s.last_fetch > adddate(s.date, interval 1 day) and si.date between ? and ? and s.type = 'sell'
                    order by rand()
                    limit 1
                `, start, end);

                return data[0];
            }

            async function shopMostExpensive() {
                let data = await connection.query(`
                    select s.id, s.owner, s.name, s.location, sum(si.price * si.count) totalPrice, s.date
                    from
                    (
                        select distinct s.owner
                        from shops s
                        where s.last_fetch > adddate(s.date, interval 1 day) and s.date between ? and ? and s.type = 'sell'
                    ) o inner join shops s on s.id = (
                        select s.id
                        from shops s inner join shop_items si on s.id = si.shop_id and si.fetch_index = 1
                        where s.owner = o.owner and s.last_fetch > adddate(s.date, interval 1 day) and s.date between ? and ? and s.type = 'sell'
                        group by s.id
                        order by sum(si.price * si.count) desc
                        limit 1
                    )
                    inner join shop_items si on s.id = si.shop_id and si.fetch_index = 1
                    group by s.id
                    order by totalPrice desc
                    limit ${limit}
                `, start, end, start, end);

                return data;
            }

            async function shopMostCheapest() {
                let data = await connection.query(`
                    select s.id, s.owner, s.name, s.location, sum(si.price * si.count) totalPrice, s.date
                    from
                    (
                        select distinct s.owner
                        from shops s
                        where s.last_fetch > adddate(s.date, interval 1 day) and s.date between ? and ? and s.type = 'sell'
                    ) o inner join shops s on s.id = (
                        select s.id
                        from shops s inner join shop_items si on s.id = si.shop_id and si.fetch_index = 1
                        where s.owner = o.owner and s.last_fetch > adddate(s.date, interval 1 day) and s.date between ? and ? and s.type = 'sell'
                        group by s.id
                        order by sum(si.price * si.count) asc
                        limit 1
                    )
                    inner join shop_items si on s.id = si.shop_id and si.fetch_index = 1
                    group by s.id
                    order by totalPrice asc
                    limit ${limit}
                `, start, end, start, end);

                return data;
            }

            async function shopMostUnstable() {
                let data = await connection.query(`
                    select max(id) id, owner, count(*) count
                    from shops
                    where date between ? and ? and type = 'sell'
                    group by owner
                    order by count desc
                    limit ${limit}
                `, start, end);

                return data;
            }

            async function shopMostExpensiveLots() {
                let data = await connection.query(`
                    select max(s.id) id, si.name, min(si.price) price
                    from shops s inner join shop_items si on s.id = si.shop_id and si.fetch_index = 1
                    where s.last_fetch > adddate(s.date, interval 1 day) and s.date between ? and ? and s.type = 'sell'
                    group by si.name
                    order by price desc
                    limit ${limit}
                `, start, end);

                return data;
            }

            async function levelUpped() {
                let data = await connection.query(`
                    select date, originalMessage message
                    from messages
                    where originalMessage like '- %сияй%'
                    and originalOwner = 'FreeRO'
                    and date between ? and ?
                    order by date
                `, start, end);

                const exp = /^- (.+?) стала? сияйкой! Поздравляем!$/;

                data = data
                    .filter(p => new RegExp(exp).test(p.message))
                    .map(p => { return {date: p.date, owner: new RegExp(exp).exec(p.message)[1]}; });

                return data;
            }

            async function levelUppedOfAWeek() {
                let data = await connection.query(`
                    select date, originalMessage message
                    from messages
                    where originalMessage like '- %сияй%'
                    and originalOwner = 'FreeRO'
                    and date between ? and ?
                    order by rand()
                    limit 1
                `, start, end);

                const exp = /^- (.+?) стала? сияйкой! Поздравляем!$/;

                data = data
                    .filter(p => new RegExp(exp).test(p.message))
                    .map(p => { return {date: p.date, owner: new RegExp(exp).exec(p.message)[1]}; });

                return data[0];
            }

            try {
                report.cardOfAWeek = await cardOfAWeek();
                report.cardDropActivity = await cardDropActivity();
                report.cardTopPlayer = await cardTopPlayer();
                report.cardTopDrop = await cardTopDrop();
                report.cardLovelyPlaces = await cardLovelyPlaces();

                report.chatStoreOfAWeek = await chatStoreOfAWeek();
                report.chatActivity = await chatActivity();
                report.chatTopSpeakers = await chatTopSpeakers();
                report.chatStoryTellers = await chatStoryTellers();

                report.shopActivity = await shopActivity();
                report.shopOfAWeek = await shopOfAWeek();
                report.shopLotOfAWeek = await shopLotOfAWeek();
                report.shopMostExpensive = await shopMostExpensive();
                report.shopMostCheapest = await shopMostCheapest();
                report.shopMostUnstable = await shopMostUnstable();
                report.shopMostExpensiveLots = await shopMostExpensiveLots();

                report.levelUpped = await levelUpped();
                report.levelUppedOfAWeek = await levelUppedOfAWeek();

                await connection.query('insert into reports(date, report, active) values(?,?,?)', new Date(), JSON.stringify(report), isActive);

            } finally {
                await connection.close();
            }

            return report;
        }


        try {
            const r = await doReport(connection, startDate, endDate);
            console.log(JSON.stringify(r, null, 2));
        } catch(e) {
            logger.error(e, e.stack);
        }

    }
}

new ReportGenerator().generate();
