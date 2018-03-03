export default function () {
    if (window['ga'] && typeof window['ga'] === 'function') {
        try {
            window['ga']('set', 'page', location.pathname + location.search);
            window['ga']('send', 'pageview', location.pathname + location.search);
        } catch (e) {
            console.warn(e);
        }
    } else {
        console.warn('window.ga is undefined');
    }
}