import * as React from 'react';
import './Cards.css';
import * as moment from 'moment';
import * as _ from 'underscore';

interface State {
    term: string;

    loading: boolean;

    data: Array<{
        card: string,
        owner: string,
        date: Date,
    }>;
}

interface Props {

}

class Cards extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = { term: '', data: [], loading: true };
        this.handleTerm = this.handleTerm.bind(this);

        this.updateSearch = _.debounce(
            this.updateSearch,
            500
        );
    }

    handleTerm(e: { target: { value: string; }; }) {
        this.setState({ term: e.target.value });
        this.updateSearch();
    }

    updateSearch() {
        console.log('Load by', this.state.term);
        this.setState({loading: true, data: []});

        const me = this;
        fetch('https://free-ro.kudesnik.cc/rest/cards' +
            (this.state.term ? '?term=' + encodeURIComponent(this.state.term) : '')
        )
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

    componentWillMount() {
        this.updateSearch();
    }

    render() {
        let data  = this.state.data;
        let term = this.state.term;

        let renderPart = data.map((d, index) =>
            (
                <tr key={index}>
                    <td className="cell100 column1">
                        <a href={'http://rodb.kudesnik.cc/item/?term=' + d.card}>{d.card}</a>
                    </td>
                    <td className="cell100 column2">{d.owner}</td>
                    <td className="cell100 column3">{moment(d.date).format('DD-MM-YYYY, HH:mm')}</td>
                </tr>
            ));

        return (
            <div className="limiter">
                <div className="input-container">
                    <input type="text" placeholder="Search..." value={term} onChange={this.handleTerm}/>
                </div>
                <table className="table_center">
                    <thead>
                        <tr>
                            <th className="column1">Card</th>
                            <th className="column2">Player</th>
                            <th className="column3">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.loading && <tr><td colSpan={3} className="cell100 column1">Loading...</td></tr>}
                        {renderPart}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Cards;
