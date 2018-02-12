var express    = require('express');
var app        = express();

app.use(express.static('build'));

app.listen(process.env.LOOTER_UI_REST_PORT);
console.log('looter-rest started, port: ' + process.env.LOOTER_UI_REST_PORT);