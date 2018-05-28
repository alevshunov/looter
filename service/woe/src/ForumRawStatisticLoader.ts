import fetch from 'node-fetch';
import {JSDOM} from 'jsdom';

declare global {
    interface Window {
        document: any;
    }
}

class ForumRawStatisticLoader {
    private readonly _threadId;

    constructor(threadId) {
        this._threadId = threadId;

    }

    public async load() : Promise<string[]> {
        // const data = await fetch(`https://forum.free-ro.com/threads/${this._threadId}/`);
        const data = await fetch(`https://forum.free-ro.com/posts/${this._threadId}/`);
        const dom = new JSDOM(await data.text());

        const msgs = dom.window.document
            .querySelectorAll('.message.staff[data-author=X] blockquote');

        let realStatMsg = '';
        for (let i=0; i<msgs.length; i++) {
            const rawmsg = msgs[i].textContent.trim();
            if (rawmsg.indexOf('Лидеры по фрагам') > -1) {
                realStatMsg = rawmsg;
                break;
            }
        }

        const rawTextMessage = realStatMsg.replace(/\*звуки сверчков\*​/g,'*звуки сверчков*​\n').split('\n').map(x => x.trim()).filter(x => x.length > 0);
        return rawTextMessage;
    }
}

export default ForumRawStatisticLoader;