var mysql = require("mysql");

var express    = require('express');
var app        = express();
var router = express.Router();

function getConnection(cb) {
    var connection = mysql.createConnection({
        host: process.env.LOOTER_DB_HOST,
        user: process.env.LOOTER_DB_USER,
        password: process.env.LOOTER_DB_PASSWORD,
        database: process.env.LOOTER_DB_DBNAME
    });

    connection.connect((e) => {
        if (e) {
            console.log(e);
            throw e;
        }

        cb(connection);
    });
}

router.get('/cards', function(req, res, next){
    const term = req.query.term ? `%${req.query.term || ''}%` : '%';

    getConnection(connection => {
        connection.query("select owner, card, date from card_drop where owner like ? or card like ? order by date desc limit 100",
            [term, term],
            (err, result) => {
                if (err) { console.log(err); throw err; }
                res.json(result);
                connection.destroy();
            }
        );
    });
});

//
// router.get('/shops', function(req, res, next){
//     console.log('GET /rest/shops', req.headers['x-forwarded-for'] || req.connection.remoteAddress);
//
//     const term = req.query.term ? `%${req.query.term || ''}%` : '%';
//
//     getConnection(connection => {
//
//         connection.query(`
//             select t1.name, t1.c as count1, t2.c as count2, t1.c - ifnull(t2.c,0) as delta, t1.minp, t1.maxp
//             from
//             (
//                 select si.name, sum(count) c, max(si.price) maxp, min(si.price) minp
//                 from shop_items si inner join shops s on s.id = si.shop_id
//                 where si.fetch_index = 1
//                 group by name
//             ) t1
//             left join
//             (
//                 select si.name, sum(count) c
//                 from shop_items si inner join shops s on s.id = si.shop_id
//                 where si.fetch_index = s.fetch_count
//                 group by si.name
//             ) t2 on t1.name = t2.name
//             where t1.name like ?
//         `,
//             [term],
//             (err, result) => {
//                 if (err) { console.log(err); throw err; }
//                 res.json(result);
//                 connection.destroy();
//             }
//         );
//     });
// });

router.get('/shops/active', function(req, res, next){
    const term = req.query.term ? `%${req.query.term || ''}%` : '%';

    getConnection(connection => {

        connection.query(`
            select si.name, sum(si.count) as count, min(si.price) as min, max(si.price) as max
            from shops s inner join shop_items si on si.shop_id = s.id
            where s.active and s.fetch_count > 0 and si.fetch_index = s.fetch_count and si.name like ?
            group by si.name
        `,
            [term],
            (err, result) => {
                if (err) { console.log(err); throw err; }
                res.json(result);
                connection.destroy();
            }
        );
    });
});

router.get('/shops/all', function(req, res, next){
    const term = req.query.term ? `%${req.query.term || ''}%` : '%';

    getConnection(connection => {
        connection.query(`
            select s.id, s.name, s.location, s.owner, s.date
            from shops s
            where s.active and s.fetch_count > 0 
            and (s.name like ? or s.owner like ? or s.location like ?)
            order by s.date desc
            limit 100
        `,
            [term, term, term],
            (err, result) => {
                if (err) { console.log(err); throw err; }
                res.json(result);
                connection.destroy();
            }
        );
    });
});

router.get('/shops/with/:itemName', function(req, res, next){
    const itemName = req.params.itemName;

    getConnection(connection => {
        connection.query(`
            select s.id, s.owner, s.location, s.name, min(si.price) min, max(si.price) max
            from shop_items si 
            inner join shops s on s.id = si.shop_id and si.fetch_index = s.fetch_count
            where si.name = ? and s.active and s.fetch_count > 0 
            group by s.id
            order by s.location
            limit 100
        `,
            [itemName],
            (err, result) => {
                if (err) { console.log(err); throw err; }
                res.json(result);
                connection.destroy();
            }
        );
    });
});

router.get('/shop/:id', function(req, res, next){
    const id = req.params.id;

    getConnection(connection => {
        connection.query(
            `
                select s.id, s.name, s.location, s.owner, s.date
                from shops s
                where s.id = ?
            `,
            [id],
            (err, result) => {

                if (err) { console.log(err); throw err; }

                var shop = result[0];

                connection.query(
                    `
                        select si.id, si.name, si.price, si.count
                        from shops s inner join shop_items si on s.id = si.shop_id and s.fetch_count = si.fetch_index
                        where s.id = ?
                        order by si.id
                    `,
                    [id],
                    (err, result) => {
                        if (err) { console.log(err); throw err; }

                        shop.items = result;
                        res.json(shop);

                        connection.destroy();
                    }
                );

            }
        );

    });
});

app.use('/rest', router);

app.use(function(err, req, res, next) {
    console.error(new Date(), err);
    res.status(404);
});

app.listen(process.env.LOOTER_REST_PORT);
console.log('looter-rest started, port: ' + process.env.LOOTER_REST_PORT);