import fetch from "node-fetch";

import {JSDOM} from 'jsdom';

class ForumStatisticWatcher {
    async load() {

        const body = `keywords=%D0%9B%D0%B8%D0%B4%D0%B5%D1%80%D1%8B+%D0%BF%D0%BE+%D1%84%D1%80%D0%B0%D0%B3%D0%B0%D0%BC&users=X&date=2017-01-01`;
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

        const id = data.url.substr(32, 9);
        // debugger;
        // const text = await data.text();


        let r = [];

        for (let i=1; i<=7; i++) {
            const data = await fetch('https://forum.free-ro.com/search' + id + '?page=' + i);
            const text = await data.text();

            const dom = new JSDOM(text);

            let x = dom.window.document.querySelectorAll('.searchResult.post.primaryContent');
            let a = [];
            x.forEach(x => a.push(x));
            let z = a.map(aa => {return {id: aa.id.split('-')[1], date: aa.querySelector('.main a').text}});
            z.forEach(z => r.push(z));
        }

        return r;
    }
}

export default ForumStatisticWatcher;