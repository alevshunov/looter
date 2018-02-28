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

function extractTermWithDirection(term: string) : {term: string, direction: string} {
    let realTerm= term || '';
    let direction = '%';

    if (/^[sSbB]\>.*/.test(realTerm)) {
        direction = realTerm[0].toLowerCase() === 's' ? 'sell' : 'buy';
        realTerm = realTerm.substring(2).trim();
    }

    realTerm = adoptTermToLike(realTerm);

    return { term: realTerm, direction: direction };
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
    const data = await connection.query(`select * from reports order by id desc limit 1`);
    connection.close();
    res.json(JSON.parse(data[0].report));

    next();
});

router.get('/shops/active', async (req, res, next) => {
    const args = extractTermWithDirection(req.query.term);
    const connection = await getConnection();
    const data = await connection.query(`
            select si.name, sum(si.count) as count, min(si.price) as min, max(si.price) as max, s.type,
            group_concat(distinct i.id order by i.id separator ', ') ids
            from shops s inner join shop_items si on si.shop_id = s.id
            left join item_db i on i.name_japanese = si.name
            where 
                s.active = 1
                and s.fetch_count > 0 
                and si.fetch_index = s.fetch_count 
                and (si.name like ? or i.id like ?)
                and s.type like ?
            group by si.name, s.type
        `,
        args.term, args.term, args.direction,
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

        data = await connection.query(`
            select si.id, si.name, si.price, si.count, group_concat(distinct i.id order by i.id separator ', ') ids
            from shops s inner join shop_items si on s.id = si.shop_id and s.fetch_count = si.fetch_index
            left join item_db i on i.name_japanese = si.name
            where s.id = ?
            group by si.id
            order by si.id
        `,
            id);

        shop.items = data;
    }

    connection.close();
    res.json(shop);

    next();
});

app.use((req, res, next) => {
    logger.log(req.path, req.ip);
    next();
});

app.use('/rest', router);

app.listen(process.env.LOOTER_REST_PORT);
logger.log('looter-rest started, port: ' + process.env.LOOTER_REST_PORT);