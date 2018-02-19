var express    = require('express');
var app        = express();

app.use(express.static('build'));

app.use(function(req, res) {
    res.sendFile(__dirname + '/build/index.html');
});

app.listen(process.env.LOOTER_UI_REST_PORT);
console.log('looter-rest started, port: ' + process.env.LOOTER_UI_REST_PORT);