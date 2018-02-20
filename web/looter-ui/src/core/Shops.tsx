import * as React from 'react';
import * as _ from 'underscore';

interface State {
    term: string;

    loading: boolean;

    data: Array<{
        name: string,
        count: number,
        min: number,
        max: number
    }>;
}

interface Props {

}

class Shops extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = { data: [], loading: true, term: '' };

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
        fetch('https://free-ro.kudesnik.cc/rest/shops/active' +
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
                me.setState({ data });
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
                        <a href={'http://rodb.kudesnik.cc/item/?term=' + d.name}>{d.name}</a>
                    </td>
                    <td className="cell100 column2">{d.count}</td>
                    <td className="cell100 column3 right">{d.min} - {d.max}</td>
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
                            <th className="column1">Name</th>
                            <th className="column2">Count</th>
                            <th className="column3">Price</th>
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

export default Shops;
