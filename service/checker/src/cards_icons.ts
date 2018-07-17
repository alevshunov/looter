import * as fs from 'fs';
import * as request from 'request';

var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

const lines = require('fs').readFileSync('src/cards.txt').toString().split(/\r?\n/);

(async function() {
    for (let i=0; i<lines.length; i++) {
        const id = lines[i];

        await new Promise(r => download(`https://rurowiki.ru/media/cards/${id}.png`, `src/img/${id}.png`, r));

    }
})();

// download('https://www.google.com/images/srpr/logo3w.png', 'google.png', function(){
//     console.log('done');
// });

