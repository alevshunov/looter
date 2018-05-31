import fetch from 'node-fetch';
import {JSDOM} from 'jsdom';

declare global {
    interface Window {
        document: any;
    }
}

class ForumRawStatisticLoader {
    private readonly _postId;

    constructor(postId) {
        this._postId = postId;

    }

    public async load() : Promise<{stat: string[], icons: string[]}> {
        // const data = await fetch(`https://forum.free-ro.com/threads/${this._postId}/`);
        const data = await fetch(`https://forum.free-ro.com/posts/${this._postId}/`);
        const dom = new JSDOM(await data.text());

        const msgs = dom.window.document
            .querySelectorAll('.message.staff[data-author=X] blockquote');

        const icons = [];

        let realStatMsg = '';
        for (let i=0; i<msgs.length; i++) {
            const rawmsg = msgs[i].textContent.trim();
            if (rawmsg.indexOf('Лидеры по фрагам') > -1) {
                realStatMsg = rawmsg;

                const iconsNodes = msgs[i].querySelectorAll('img[data-url^="https://www.free-ro.com/public/emblem/"]');
                iconsNodes.forEach((ic: any) => icons.push(ic.dataset.url));
                break;
            }
        }

        const rawTextMessage = realStatMsg.replace(/\*звуки сверчков\*​/g,'*звуки сверчков*​\n').split('\n').map(x => x.trim()).filter(x => x.length > 0);
        return {stat: rawTextMessage, icons: icons};
    }
}

export default ForumRawStatisticLoader;