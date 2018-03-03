export default function () {
    const last = window['last'] || (location.pathname + location.search);

    if (window['ga']
        && typeof window['ga'] === 'function'
        && typeof window['ga'].create === 'function') {
        const tracker = window['tracker'] || window['ga'].create('UA-115035514-1');

        if (last !== location.pathname + location.search) {
            try {
                tracker.set('page', location.pathname + location.search);
                tracker.send('pageview');
            } catch (e) {
                console.warn(e);
            }
        }

        window['tracker'] = tracker;
    } else {
        console.warn('window.ga is undefined');
    }

    window['last'] = location.pathname + location.search;
}