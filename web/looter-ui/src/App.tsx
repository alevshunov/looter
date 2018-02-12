import * as React from 'react';
import './App.css';
import * as moment from 'moment';

interface State {
    data: Array<{
        card: string,
        owner: string,
        date: Date
    }>;
}

interface Props {

}

class App extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        let data: Array<{
            card: string,
            owner: string,
            date: Date
        }> = [];

        this.state = { data };
    }

    componentWillMount() {
        const me = this;
        fetch('/rest/cards')
            .then((response) => {
                try {
                    return response.json();
                } catch (e) {
                    return [];
                }
            })
            .then((data) => {
                me.setState({ data });
            });
    }

    render() {
        let data  = this.state.data;
        let renderPart = data.map((d, index) =>
            (
                <tr key={index}>
                    <td className="cell100 column1">
                        <a href={'http://rodb.kudesnik.cc/item/?term=' + d.card}>{d.card}</a>
                    </td>
                    <td className="cell100 column2">{d.owner}</td>
                    <td className="cell100 column3">{moment(d.date).add(3, 'hours').format('DD-MM-YYYY, HH:mm:ss')}</td>
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
