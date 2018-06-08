var express    = require('express');
var htmlencode    = require('htmlencode').htmlEncode;
var fs    = require('fs');
var app        = express();

app.use(express.static('build', {index: false}));

titleMapper = function(url) {
    console.log(url);
    const mappers = [];
    mappers.push({ exp: /^\/$/, fn: () => Promise.resolve('FreeRO - I see You!')});

    mappers.push({
        exp: /^\/woe\/?$/,
        fn: () =>
            Promise.resolve('FreeRO - WoE')
    });

    mappers.push({
        exp: /^\/woe\/history\/$/,
        fn: () =>
            Promise.resolve('FreeRO - WoE - История')
    });

    mappers.push({
        exp: /^\/woe\/castles\/$/,
        fn: () =>
            Promise.resolve('FreeRO - WoE - Замки')
    });

    mappers.push({
        exp: /^\/woe\/players\/$/,
        fn: () =>
            Promise.resolve('FreeRO - WoE - Игроки')
    });

    mappers.push({
        exp: /^\/woe\/guilds\/$/,
        fn: () =>
            Promise.resolve('FreeRO - WoE - Гильдии')
    });

    mappers.push({
        exp: /^\/woe\/player\/(.+)$/,
        fn: (parts) =>
            Promise.resolve('FreeRO - ' + decodeURIComponent(parts[1]))
    });

    mappers.push({
        exp: /^\/woe\/guild\/(.+)\/(.+)$/,
        fn: (parts) =>
            Promise.resolve('FreeRO - ' + decodeURIComponent(parts[2]))
    });

    mappers.push({
        exp: /^\/woe\/(.+)$/,
        fn: (parts) =>
            Promise.resolve('FreeRO - WoE - #' + decodeURIComponent(parts[1]))
    });

    mappers.push({
        exp: /^\/cards\/?$/,
        fn: () =>
            Promise.resolve('FreeRO - Карты')
    });

    mappers.push({
        exp: /^\/cards\/(.+)$/,
        fn: (parts) =>
            Promise.resolve('FreeRO - Карты - ' + decodeURIComponent(parts[1]))
    });

    mappers.push({
        exp: /^\/shop\/(.+)$/,
        fn: (parts) =>
            Promise.resolve('FreeRO - Магазин - #' + decodeURIComponent(parts[1]))
    });

    mappers.push({
        exp: /^\/shops\/?$/,
        fn: (parts) =>
            Promise.resolve('FreeRO - Магазины')
    });

    mappers.push({
        exp: /^\/shops\/with\/(.+)$/,
        fn: (parts) =>
            Promise.resolve('FreeRO - Магазины - ' + decodeURIComponent(parts[1]))
    });

    mappers.push({
        exp: /^\/shops\/(.+)$/,
        fn: (parts) =>
            Promise.resolve('FreeRO - Магазины - ' + decodeURIComponent(parts[1]))
    });

    mappers.push({
        exp: /^\/items\/?$/,
        fn: (parts) =>
            Promise.resolve('FreeRO - Товары')
    });


    mappers.push({
        exp: /^\/items\/(.+)$/,
        fn: (parts) =>
            Promise.resolve('FreeRO - Товар - ' + decodeURIComponent(parts[1]))
    });

    mappers.push({
        exp: /^\/item\/history\/(.+)$/,
        fn: (parts) =>
            Promise.resolve('FreeRO - История - ' + decodeURIComponent(parts[1]))
    });


    mappers.push({
        exp: /^\/report\/?$/,
        fn: (parts) =>
            Promise.resolve('FreeRO - Отчет')
    });


    mappers.push({ exp: /^.*$/, fn: () => Promise.resolve('FreeRO - O_o')});

    for (let i=0; i<mappers.length; i++) {
        if (new RegExp(mappers[i].exp).test(url)) {
            return mappers[i].fn(new RegExp(mappers[i].exp).exec(url));
        }
    }
};


app.use(function(req, res) {
    fs.readFile(__dirname + '/build/index.html', 'utf8', (err, data) => {
        titleMapper(req.url).then((title) => {
            res.send(data.replace('$$$TITLE$$$', htmlencode(title)));
        });

    });

    // res.sendFile(__dirname + '/build/index.html');
});

app.listen(process.env.LOOTER_UI_REST_PORT || 8888);
console.log('looter-ui started, port: ' + (process.env.LOOTER_UI_REST_PORT || 8888));