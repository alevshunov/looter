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
        const msg = dom.window.document.querySelector('.message.staff[data-author=X] blockquote');
        const rawTextMessage = msg.textContent.trim().replace(/\*звуки сверчков\*​/g,'*звуки сверчков*​\n').split('\n').map(x => x.trim()).filter(x => x.length > 0);
        return rawTextMessage;
    }
}

export default ForumRawStatisticLoader;