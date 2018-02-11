import * as React from 'react';
import './App.css';

class App extends React.Component {
    render() {

        let data = [];

        data.push({'cardName': 'Necromancer Card', 'owner': 'Адриэлуна', 'date': '2018-02-10T20:22:32.933Z'});

        data.push({'cardName': 'Raydric Card', 'owner': 'Краб Михалыч', 'date': '2018-02-10T20:20:36.426Z'});

        data.push({'cardName': 'Kasa Card', 'owner': 'Shinitakunai', 'date': '2018-02-10T20:13:55.754Z'});

        data.push({'cardName': 'Ragged Zombie Card', 'owner': 'Rixas', 'date': '2018-02-10T19:41:26.211Z'});

        data.push({'cardName': 'Zombie Slaughter Card', 'owner': 'From_The_Cradle',
            'date': '2018-02-10T19:40:03.415Z'});
        data.push({'cardName': 'Poring Card', 'owner': 'TwinkleBumblebee', 'date': '2018-02-10T19:24:14.532Z'});

        let renderPart = data.map((d, index) =>
            (
                <tr key={index}>
                    <td className="cell100 column1">{d.cardName}</td>
                    <td className="cell100 column2">{d.owner}</td>
                    <td className="cell100 column3">{d.date}</td>
                </tr>
            ));

        return (
            <div className="limiter">
                <table className="table_center">
                    <thead>
                        <tr>
                            <th className="column1">Card</th>
                            <th>Player</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderPart}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default App;
