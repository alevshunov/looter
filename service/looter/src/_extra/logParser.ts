import * as moment from 'moment';
import * as fs from 'fs';


let date = moment("20160101", "YYYYMMDD");
let now = moment();

const format = 'YYYY-MM-DD HH:mm:SS';

const cardsBefore = moment('2018-02-11 13:58:06', 'YYYY-MM-DD HH:mm:SS');
const tradersBefore = moment('2018-02-15 20:47:39', 'YYYY-MM-DD HH:mm:SS');

let cards = [], sells = [], buys = [];

const content = fs.readFileSync('/Users/alevshunov/Downloads/logs-irc/_exists.json', 'utf8');
const data = JSON.parse(content).map(x => x.owner);
const existsTraders = {};

data.forEach(o => { existsTraders[o] = true; } );

while (date < now) {
    date = date.add({day: 1});

    const expectedFileName = `/Users/alevshunov/Downloads/logs-irc/channel_#freero.freero_${date.format('YYYY.MM.DD')}.log`;

    if (fs.existsSync(expectedFileName)) {
        console.log(expectedFileName);

        const data = fs.readFileSync(expectedFileName, 'utf8');

        const expCard = /25? \[(.+?)\] <.11,14@\s!nc\s(.+?)\s.> ?-? ?\s!c\s#main\s : \[Server\] '(.+?)' выбила? '(.+?)'\. Грац\!/g;
        const expSell = /25? \[(.+?)\] <.11,14@\s!nc\s(.+?)\s.> ?-? ?\s!c\s#main\s \: \[Server\] '(.+?)' открывает магазин '(.+?)' \(коорд\.\: (.+ <[0-9]+,[0-9]+>)\)\./g;
        const expBuy = /25? \[(.+?)\] <.11,14@\s!nc\s(.+?)\s.> ?-? ?\s!c\s#main\s \: \[Server\] '(.+?)' открывает скупку под названием '(.+?)' \(коорд\.\: (.+ <[0-9]+,[0-9]+>)\)\./g;

        let myArray;
        while ((myArray = expCard.exec(data)) !== null) {
            let msg = myArray.slice(1);

            if (msg[1] !== 'FreeRO') {
                continue;
            }

            cards.push({date: moment(date.format('YYYY-MM-DD') + ' ' + msg[0], format), owner: msg[2], card: msg[3]});
        }

        while ((myArray = expSell.exec(data)) !== null) {
            let msg = myArray.slice(1);

            if (msg[1] !== 'FreeRO') {
                continue;
            }

            sells.push({date: moment(date.format('YYYY-MM-DD') + ' ' + msg[0], format), owner: msg[2], name: msg[3], location: msg[4], type: 'sell'});
        }

        while ((myArray = expBuy.exec(data)) !== null) {
            let msg = myArray.slice(1);

            if (msg[1] !== 'FreeRO') {
                continue;
            }

            buys.push({date: moment(date.format('YYYY-MM-DD') + ' ' + msg[0], format), owner: msg[2], name: msg[3], location: msg[4], type: 'buy'});
        }



        // console.log(data.length);
    }
}

const traders = {};
const newTraders = [];

sells.filter(s => !existsTraders[s.owner]).forEach(s => {traders[s.owner] = {date: s.date, item: s};});
buys.filter(s => !existsTraders[s.owner]).forEach(s => {
    traders[s.owner] = !traders[s.owner] ? { date: s.date, item: s } : traders[s.owner];

    if (traders[s.owner].date < s.date) {
        traders[s.owner] = {date: s.date, item: s};
    }
});

for (let x in traders) {
    if (!traders.hasOwnProperty(x)) continue;

    newTraders.push(traders[x].item);
}

function escape(str) {
    return str.replace(/\\/g,'\\\\').replace(/'/g,'\\\'');
}

cards = cards.filter(c => c.date < cardsBefore);


fs.writeFileSync('/Users/alevshunov/Downloads/logs-irc/_cards.json', JSON.stringify(cards, null, 2));
fs.writeFileSync('/Users/alevshunov/Downloads/logs-irc/_cards.sql',
    'INSERT INTO card_drop (owner, card, date, batch) VALUES\n' + cards.map((c) => `('${escape(c.owner)}','${escape(c.card)}','${c.date.format(format)}', 1)`).join(',\n') + ';');

fs.writeFileSync('/Users/alevshunov/Downloads/logs-irc/_traders.json', JSON.stringify(newTraders, null, 2));
fs.writeFileSync('/Users/alevshunov/Downloads/logs-irc/_traders.sql',
    'INSERT INTO shops (owner, name, location, date, type, batch) VALUES\n' +
    newTraders
        .map((t) => `('${escape(t.owner)}','${escape(t.name)}','${escape(t.location)}','${t.date.format(format)}','${t.type}', 1)`).join(',\n')
    + ';');
