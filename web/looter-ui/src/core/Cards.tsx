import * as React from 'react';
import * as moment from 'moment';
import RedirectableSearch from './components/RedirectableSearch';
import { NavLink } from 'react-router-dom';

interface State {
    loading: boolean;

    data: Array<{
        card: string,
        owner: string,
        date: Date,
    }>;
}

interface Props {
    term: string;
}

class Cards extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            data: [],
            loading: true
        };

    }

    componentWillMount() {
        this.doLoad();
    }

    componentWillReceiveProps(props: Props) {
        setTimeout(this.doLoad.bind(this), 1);
    }

    doLoad() {
        this.setState({loading: true, data: []});

        const me = this;
        fetch('https://free-ro.kudesnik.cc/rest/cards?term=' + encodeURIComponent(this.props.term))
            .then((response) => {
                try {
                    return response.json();
                } catch (e) {
                    return [];
                }
            })
            .then((data) => {
                me.setState({ data, loading: false });
            });

    }

    render() {
        document.title = this.props.term ? 'FreeRO - Cards - ' + this.props.term : 'FreeRO - Cards';

        return (
            <div className="limiter">
                <RedirectableSearch base="/cards/" term={this.props.term}/>
                <table className="table_center">
                    <thead>
                        <tr>
                            <th className="column1">Card</th>
                            <th className="column2">Player</th>
                            <th className="column3">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.loading && <tr><td className="cell100 column1">Loading ...</td></tr>}
                        {
                            !this.state.loading && this.state.data.length === 0 &&
                            <tr>
                                <td className="cell100 column1">No data.</td>
                            </tr>
                        }
                        {
                            this.state.data.map((d, index) =>
                                (
                                    <tr key={index}>
                                        <td className="cell100 column1">
                                            <NavLink to={'/items/' + d.card}>{d.card}</NavLink>
                                            {/*<a href={'http://rodb.kudesnik.cc/item/?term=' + d.card}>{d.card}</a>*/}
                                        </td>
                                        <td className="cell100 column2">{d.owner}</td>
                                        <td className="cell100 column3">
                                            {moment(d.date).format('DD-MM-YYYY, HH:mm')}
                                        </td>
                                    </tr>
                                ))
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Cards;
