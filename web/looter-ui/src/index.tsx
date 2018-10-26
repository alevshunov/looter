import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import * as x from './registerServiceWorker';
import './index.css';
import * as moment from 'moment';

moment.locale('ru');

ReactDOM.render(
    <App />,
    document.getElementById('root') as HTMLElement
);
x.unregister();

const items = [
    '1.jpg',
    '2.png',
    '3.png',
    '4.png',
    '5.png',
    '6.jpg'
];

const area = document.getElementById('img');

function setBgImg() {
    if (!area) {
        return;
    }

    if (!(new Date().getHours() >= 18 || new Date().getHours() <= 5)) {
        area.setAttribute('style', 'background-image: none;');
    } else {
        let item = items[Math.floor(Math.random() * items.length)];
        area.setAttribute('style', 'background-image: url(/img/' + item + '); animation: pulse 60s infinite;');
    }
}

if (area) {
    setBgImg();

    setInterval(() => {
        setBgImg();
    }, 60000);
}