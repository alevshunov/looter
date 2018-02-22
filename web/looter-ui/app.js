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
        exp: /^\/cards\/?$/,
        fn: () =>
            Promise.resolve('FreeRO - Cards')
    });

    mappers.push({
        exp: /^\/cards\/(.+)$/,
        fn: (parts) =>
            Promise.resolve('FreeRO - Cards - ' + decodeURIComponent(parts[1]))
    });

    mappers.push({
        exp: /^\/shop\/(.+)$/,
        fn: (parts) =>
            Promise.resolve('FreeRO - Shop - #' + decodeURIComponent(parts[1]))
    });

    mappers.push({
        exp: /^\/shops\/?$/,
        fn: (parts) =>
            Promise.resolve('FreeRO - Shops')
    });

    mappers.push({
        exp: /^\/shops\/with\/(.+)$/,
        fn: (parts) =>
            Promise.resolve('FreeRO - Shops - ' + decodeURIComponent(parts[1]))
    });

    mappers.push({
        exp: /^\/shops\/(.+)$/,
        fn: (parts) =>
            Promise.resolve('FreeRO - Shops - ' + decodeURIComponent(parts[1]))
    });

    mappers.push({
        exp: /^\/items\/?$/,
        fn: (parts) =>
            Promise.resolve('FreeRO - Price list')
    });


    mappers.push({
        exp: /^\/items\/(.+)$/,
        fn: (parts) =>
            Promise.resolve('FreeRO - Price - ' + decodeURIComponent(parts[1]))
    });


    mappers.push({
        exp: /^\/report\/?$/,
        fn: (parts) =>
            Promise.resolve('FreeRO - Weekly report')
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