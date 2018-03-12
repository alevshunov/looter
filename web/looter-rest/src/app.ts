import * as express from 'express';
import { MyConnection, MyLogger } from 'my-core';

const app = express();
const router = express.Router();
const logger = new MyLogger();

const db = {
    host: process.env.LOOTER_DB_HOST,
    user: process.env.LOOTER_DB_USER,
    password: process.env.LOOTER_DB_PASSWORD,
    database: process.env.LOOTER_DB_DBNAME
};

function getConnection() {
    return new MyConnection(db, logger).open();
}

function adoptTermToLike(term: string) {
    term = term || '';
    term = term.trim();

    if (term.length === 0) {
        return '%';
    }

    return `%${term.replace('*', '%') || ''}%`;
}

function extractTermWithDirection(term: string) : {term: string, direction: string, minPrice: number, maxPrice: number} {
    term = term || '';

    let direction = '%';
    let minPrice = 0;
    let maxPrice = 1000000000;
    let realTerm = '';

    let terms = term.split('&').map(x => x.trim());

    for (let i=0; i<terms.length; i++) {
        let termPart = terms[i];

        if (/^[sSbB]\>.*/.test(termPart)) {
            direction = termPart[0].toLowerCase() === 's' ? 'sell' : 'buy';
            realTerm = termPart.substring(2).trim();
        } else
        if (/^[pP](\>|\<)([0-9]+).*/.test(termPart)) {
            let price = parseInt(termPart.substring(2).trim());
            if (termPart[1] === '>') {
                minPrice = price;
            } else {
                maxPrice = price;
            }
        } else {
            realTerm = termPart;
        }
    }

    realTerm = adoptTermToLike(realTerm);

    return { term: realTerm, direction: direction, maxPrice, minPrice };
}

router.get('/cards', async (req, res, next) => {
    const term = adoptTermToLike(req.query.term);

    const connection = await getConnection();
    const data = await connection.query(`
            select owner, card, date, group_concat(distinct i.id order by i.id separator ', ') ids
            from card_drop left join item_db i on i.name_japanese = card
            where owner like ? or card like ? or i.id like ?
            group by card_drop.id
            order by date desc 
            limit 100
        `,
        term, term, term);
    connection.close();
    res.json(data);

    next();
});

router.get('/report', async (req, res, next) => {
    const connection = await getConnection();
    const data = await connection.query(`select * from reports where active = 1 order by id desc limit 1`);
    connection.close();
    res.json(JSON.parse(data[0].report));

    next();
});

router.get('/report/preview', async (req, res, next) => {
    const connection = await getConnection();
    const data = await connection.query(`select * from reports order by id desc limit 1`);
    connection.close();
    res.json(JSON.parse(data[0].report));

    next();
});

router.get('/shops/active', async (req, res, next) => {
    const args = extractTermWithDirection(req.query.term);
    const connection = await getConnection();
    const data = await connection.query(`
            select si.name, sum(si.count) as count, min(si.price) as min, max(si.price) as max, s.type, i.ids
            from shops s inner join shop_items si on si.shop_id = s.id
            left join (
                select name_japanese, group_concat(distinct id order by id separator ', ') ids 
                from item_db
                group by name_japanese
            ) i
            on i.name_japanese = si.name
            where 
                s.active = 1
                and s.fetch_count > 0 
                and si.fetch_index = s.fetch_count 
                and (si.name like ? or i.ids like ?)
                and s.type like ?
            group by 
                si.name, s.type
            having
				min(si.price) >= ? and max(si.price) <= ?
        `,
        args.term, args.term, args.direction, args.minPrice, args.maxPrice
    );
    connection.close();
    res.json(data);

    next();
});

router.get('/shops/all', async (req, res, next) => {
    const args = extractTermWithDirection(req.query.term);
    const connection = await getConnection();
    const data = await connection.query(`
            select s.id, s.name, s.location, s.owner, s.date, s.type
            from shops s
            where s.active = 1 and s.fetch_count > 0 
            and (s.name like ? or s.owner like ? or s.location like ?)
            and type like ?
            order by s.date desc
            limit 100
        `,
        args.term, args.term, args.term, args.direction,
    );
    connection.close();
    res.json(data);

    next();
});

router.get('/shops/with/:itemName', async (req, res, next) => {
    const itemName = req.params.itemName;
    const connection = await getConnection();
    const data = await connection.query(`
            select s.id, s.owner, s.location, s.name, min(si.price) min, max(si.price) max, s.type
            from shop_items si 
            inner join shops s on s.id = si.shop_id and si.fetch_index = s.fetch_count
            where si.name = ? and s.active = 1 and s.fetch_count > 0 
            group by s.id
            order by min asc
            limit 100
        `,
            itemName,
    );
    connection.close();
    res.json(data);

    next();
});

router.get('/shop/:id', async (req, res, next) => {
    const id = req.params.id;
    let shop = null;

    const connection = await getConnection();
    let data = await connection.query(`
                select s.id, s.name, s.location, s.owner, s.date, s.last_fetch lastFetch, s.active, s.type
                from shops s
                where s.id = ?
            `,
            id);

    if (data.length > 0) {
        shop = data[0];

        const dataStart = await connection.query(`
            select si.id, si.name, si.price, si.count, group_concat(distinct i.id order by i.id separator ', ') ids
            from shops s inner join shop_items si on s.id = si.shop_id and 1 = si.fetch_index
            left join item_db i on i.name_japanese = si.name
            where s.id = ?
            group by si.id
            order by si.id -- si.name, si.price, si.id
        `,
            id);

        const dataCurrent = await connection.query(`
            select si.id, si.name, si.price, si.count, group_concat(distinct i.id order by i.id separator ', ') ids
            from shops s inner join shop_items si on s.id = si.shop_id and s.fetch_count = si.fetch_index
            left join item_db i on i.name_japanese = si.name
            where s.id = ?
            group by si.id
            order by si.id -- si.name, si.price, si.id
        `,
            id);

        let i=0, j=0;

        while (i<dataStart.length) {
            if (dataCurrent[j] && dataStart[i].name === dataCurrent[j].name && dataStart[i].price === dataCurrent[j].price) {
                dataStart[i].count = { start: dataStart[i].count, end: dataCurrent[j].count };
                i++;
                j++;
            } else {
                dataStart[i].count = { start: dataStart[i].count, end: 0 };
                i++;
            }
        }

        shop.items = dataStart;
    }

    connection.close();
    res.json(shop);

    next();
});

app.use(async (req, res, next) => {
    logger.log(req.headers["x-real-ip"], req.originalUrl || req.url || req.path || '');

    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    const connection = await getConnection();
    await connection.query(`insert into logs(date, type, ip, url) values(?, ?, ?, ?);`,
        new Date(), 'rest', req.headers["x-real-ip"] || '', req.originalUrl || req.url || req.path || '');

    connection.close();

    next();
});

app.use('/rest', router);

if (!process.env.LOOTER_REST_PORT) {
    throw 'LOOTER_REST_PORT is requred';
}

app.listen(process.env.LOOTER_REST_PORT);
logger.log('looter-rest started, port: ' + process.env.LOOTER_REST_PORT);