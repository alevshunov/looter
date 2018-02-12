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

app.use('/rest', router);

app.listen(process.env.LOOTER_REST_PORT);
console.log('looter-rest started, port: ' + process.env.LOOTER_REST_PORT);