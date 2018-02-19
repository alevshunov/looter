var mysql = require("mysql");

var express    = require('express');
var app        = express();
var router = express.Router();

router.get('/cards', function(req, res, next){
    console.log('GET /rest/cards', req.headers['x-forwarded-for'] || req.connection.remoteAddress);

    var connection = mysql.createConnection({
        host: process.env.LOOTER_DB_HOST,
        user: process.env.LOOTER_DB_USER,
        password: process.env.LOOTER_DB_PASSWORD,
        database: process.env.LOOTER_DB_DBNAME
    });

    connection.connect((e) => {
        if(e) {
            console.log(e);
            throw e;
        }

        connection.query("select owner, card, date from card_drop order by date desc limit 100;",
            (err, result) => {
                if (err) { console.log(err); throw err; }
                res.json(result);
                connection.destroy();
            }
        );
    });
});

router.get('/shops', function(req, res, next){
    console.log('GET /rest/shops', req.headers['x-forwarded-for'] || req.connection.remoteAddress);

    var connection = mysql.createConnection({
        host: process.env.LOOTER_DB_HOST,
        user: process.env.LOOTER_DB_USER,
        password: process.env.LOOTER_DB_PASSWORD,
        database: process.env.LOOTER_DB_DBNAME
    });

    connection.connect((e) => {
        if(e) {
            console.log(e);
            throw e;
        }

        connection.query(`
            select t1.name, t1.c as count1, t2.c as count2, t1.c - ifnull(t2.c,0) as delta, t1.minp, t1.maxp
            from
            (
                select si.name, sum(count) c, max(si.price) maxp, min(si.price) minp
                from shop_items si inner join shops s on s.id = si.shop_id
                where si.fetch_index = 1
                group by name
            ) t1
            left join
            (
                select si.name, sum(count) c
                from shop_items si inner join shops s on s.id = si.shop_id
                where si.fetch_index = s.fetch_count 
                group by si.name
            ) t2 on t1.name = t2.name
        `,
            (err, result) => {
                if (err) { console.log(err); throw err; }
                res.json(result);
                connection.destroy();
            }
        );
    });
});

router.get('/shops/active', function(req, res, next){
    console.log('GET /rest/shops/active', req.headers['x-forwarded-for'] || req.connection.remoteAddress);

    var connection = mysql.createConnection({
        host: process.env.LOOTER_DB_HOST,
        user: process.env.LOOTER_DB_USER,
        password: process.env.LOOTER_DB_PASSWORD,
        database: process.env.LOOTER_DB_DBNAME
    });

    connection.connect((e) => {
        if(e) {
            console.log(e);
            throw e;
        }

        connection.query(`
            select si.name, sum(si.count) as count, min(si.price) as min, max(si.price) as max
            from shops s inner join shop_items si on si.shop_id = s.id
            where s.active and s.fetch_count > 0 and si.fetch_index = s.fetch_count
            group by si.name
        `,
            (err, result) => {
                if (err) { console.log(err); throw err; }
                res.json(result);
                connection.destroy();
            }
        );
    });
});

app.use('/rest', router);

app.listen(process.env.LOOTER_REST_PORT);
console.log('looter-rest started, port: ' + process.env.LOOTER_REST_PORT);