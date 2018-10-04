import fetch from "node-fetch";

import {JSDOM} from 'jsdom';
import moment = require('moment');
import {MyLogger} from "my-core";

class ForumStatisticWatcher {
    private _logger: MyLogger;

    constructor(logger: MyLogger) {
        this._logger = logger;
    }

    async load() {

        const date = process.env.LOOTER_START_DATE || moment().startOf('month').format('YYYY-MM-DD');
        const body = `keywords=%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B+%D0%BF%D0%BE+%D1%84%D1%80%D0%B0%D0%B3%D0%B0%D0%BC&users=X&date=${date}`;

        this._logger.log(`Fetching search by ${body}`);

        // // const body = `keywords=%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B+%D0%BF%D0%BE+%D1%84%D1%80%D0%B0%D0%B3%D0%B0%D0%BC&users=X&date=&nodes%5B%5D=41&order=date`;
        // // const body = `keywords=%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B+%D0%BF%D0%BE+%D1%84%D1%80%D0%B0%D0%B3%D0%B0%D0%BC&users=X&date=date=2017-01-01&nodes%5B%5D=41`;
        const data = await fetch(`https://forum.free-ro.com/search/search`,
            {
                method: 'POST',
                body,
                headers: {
                    //'Cookie': coockies,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'text/html'
                    }
            });

        this._logger.log(`Navigated to ${data.url}`);

        const id = data.url.substr(32, 9);

        this._logger.log(`Search ID detected: ${id}`);

        let r = [];

        let i =0;

        do {
            i++;
            const url = 'https://forum.free-ro.com/search' + id + '?page=' + i;
            this._logger.log(`Loading page #${i} by url: ${url} ....`);
            const data = await fetch(url);
            const text = await data.text();

            const dom = new JSDOM(text);

            let x = dom.window.document.querySelectorAll('.searchResult.post.primaryContent');
            let a = [];
            x.forEach(x => a.push(x));
            this._logger.log(`Found ${x.length} posts.`);

            if (a.length === 0) {
                break;
            }

            let z = a.map(aa => {
                this._logger.log(`Parsing post ${aa.id}, ${aa.querySelector('.main a').text}.`);

                return {id: aa.id.split('-')[1], name: aa.querySelector('.main a').text}
            });
            z.forEach(z => r.push(z));
        } while(true);

        this._logger.log(`Date detection...`);

        r.forEach(item => {
            this._logger.log(`Parsing date of ${item.id}: ${item.name}...`);
            try {
                item.date = moment(item.name.split(' ')[1], 'DD.MM.YYYY').toDate();
            } catch {
                item.date = moment().startOf('day').toDate();
            }
            this._logger.log(`Parsed as ${item.date}.`);
        });

        r.sort((a, b) => {
            return a.date < b.date ? -1 : a.date == b.date ? 0 : 1;
        });

        r = r.filter(x => x.date >= new Date(2017, 0, 1));

        this._logger.log(`Returning ${r.length} records.`);
        return r;
    }
}

export default ForumStatisticWatcher;