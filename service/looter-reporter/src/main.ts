import moment = require('moment');
import { MyConnection } from './MyConnection';

const dbConnection = {
    host: process.env.LOOTER_DB_HOST,
    user: process.env.LOOTER_DB_USER,
    password: process.env.LOOTER_DB_PASSWORD,
    database: process.env.LOOTER_DB_DBNAME
};

class Report {
    cardOfAWeek: string;
    cardDropActivity: Array<number>;
    cardTopPlayer: Array<{owner: string; count: number}>;
    cardTopDrop: Array<{card: string; count: number}>;
    cardLovelyPlaces: Array<{card: string; owner: string; count: number}>;

    chatStoreOfAWeek: {owner: string; message: string; date: Date;};
    chatActivity: Array<number>;
    chatTopSpeakers: Array<{owner: string; count: number; randomMessage: string;}>;
    chatStoryTellers: Array<{owner: string; averageLength: number; randomMessage: string;}>;
    // chatMostSmilest: Array<{owner: string; count: number; randomMessage: string;}>;

    shopOfAWeek: {owner: string; name: string; location: string; };
    shopLotOfAWeek: {name: string;owner: string; shopName: string; location: string; };
    shopMostExpensive: Array<{owner: string; name: string; totalPrice: number; location: string; }>;
    shopMostCheapest: Array<{owner: string; totalPrice: number; location: string; }>;
    shopMostUnstable: Array<{owner: string; count: number; }>;
    // shopMostSellableItems: Array<{name: string; count: number; totalValue: number}>;
    shopMostExpensiveLots: Array<{name: string; price: number; shopName: string; shopOwner: string;}>;
}

const startDate = moment("2018-02-19", "YYYY-MM-DD").toDate();
const endDate = moment("2018-02-19", "YYYY-MM-DD").add({ days: 7}).toDate();

const connection = new MyConnection(dbConnection);


async function doReport(connection: MyConnection, start: Date, end: Date) {
    await connection.open();
    const report = new Report();
    const limit = 10;

    function createZeroArray(len: number) {
        const a = new Array(len);
        for (let i=0; i<len; i++) {
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
            where owner != '' and message != '' and owner != 'FreeRO-PM' and date between ? and ?
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

        for (let i=0; i<data.length; i++) {
            a[data[i].hour] = data[i].value;
        }

        return a;
    }

    async function chatTopSpeakers() {
        let data = await connection.query(`
            select t.owner, t.count, (select message from messages m where t.owner = m.owner order by rand() limit 1) randomMessage
            from
                (
                    select owner, count(*) count
                    from messages msg
                    where owner != '' and message != '' and owner != 'FreeRO-PM' and date between ? and ? 
                    group by owner
                    order by count desc
                    limit ${limit}
                ) t
        `, start, end);

        return data;
    }

    async function chatStoryTellers() {
        let data = await connection.query(`
            select t.owner, round(t.avgLength) averageLength, 
                (select message from messages m where t.owner = m.owner order by rand() limit 1) randomMessage
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
        `, start, end);

        return data;
    }

    async function shopOfAWeek() {
        let data = await connection.query(`
            select owner, name, location
            from shops
            where fetch_count > 3 and date between ? and ?
            order by rand()
            limit 1
        `, start, end);

        return data[0];
    }

    async function shopLotOfAWeek() {
        let data = await connection.query(`
            select si.name, s.owner, s.name shopName, s.location
            from shops s inner join shop_items si on s.id = si.shop_id
            where s.fetch_count > 3 and si.date between ? and ?
            order by rand()
            limit 1
        `, start, end);

        return data[0];
    }

    async function shopMostExpensive() {
        let data = await connection.query(`
            select s.id, s.owner, s.name, s.location, sum(si.price * si.count) totalPrice
            from shops s inner join shop_items si on s.id = si.shop_id and si.fetch_index = 1
            where s.fetch_count > 3 and s.date between ? and ?
            group by s.id
            order by totalPrice desc
            limit ${limit}
        `, start, end);

        return data;
    }

    async function shopMostCheapest() {
        let data = await connection.query(`
            select s.id, s.owner, s.name, s.location, sum(si.price * si.count) totalPrice
            from shops s inner join shop_items si on s.id = si.shop_id and si.fetch_index = 1
            where s.fetch_count > 3 and s.date between ? and ?
            group by s.id
            order by totalPrice asc
            limit ${limit}
        `, start, end);

        return data;
    }

    async function shopMostUnstable() {
        let data = await connection.query(`
            select owner, count(*) count
            from shops
            where date between ? and ?
            group by owner
            order by count desc
            limit ${limit}
        `, start, end);

        return data;
    }

    async function shopMostExpensiveLots() {
        let data = await connection.query(`
            select si.name, max(si.price) price
            from shops s inner join shop_items si on s.id = si.shop_id and si.fetch_index = 1
            where s.fetch_count > 3 and s.date between ? and ?
            group by si.name
            order by price desc
            limit ${limit}
        `, start, end);

        return data;
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

        report.shopOfAWeek = await shopOfAWeek();
        report.shopLotOfAWeek = await shopLotOfAWeek();
        report.shopMostExpensive = await shopMostExpensive();
        report.shopMostCheapest = await shopMostCheapest();
        report.shopMostUnstable = await shopMostUnstable();
        report.shopMostExpensiveLots = await shopMostExpensiveLots();

        await connection.query('insert into reports(date, report) values(?,?)', new Date(), JSON.stringify(report));

    } finally {
        await connection.close();
    }

    return report;
}


doReport(connection, startDate, endDate).then((r) => {
    console.log(JSON.stringify(r, null, 2));
});

