import * as React from 'react';
import { Link } from 'react-router-dom';
import * as _ from 'underscore';

interface State {
    loading: boolean;
    data: Array<any>;
    term: string;
}

interface Props {
}

class Shops extends React.Component<Props, State> {

    enqueueLoad: () => void;

    constructor(props: Props) {
        super(props);

        this.state = { term: '', data: [], loading: true };
        this.handleTerm = this.handleTerm.bind(this);

        this.enqueueLoad = _.debounce(
            this.doLoad,
            500
        );
    }

    doLoad() {
        this.setState({loading: true, data: []});

        const me = this;
        fetch('https://free-ro.kudesnik.cc/rest/shops/all' +
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

    handleTerm(e: { target: { value: string; }; }) {
        this.setState({ term: e.target.value });
        this.enqueueLoad();
    }

    componentWillMount() {
        this.doLoad();
    }

    render() {
        let data  = this.state.data;
        let term = this.state.term;

        let renderPart = data.map((d, index) =>
            (
                <tr key={index}>
                    <td className="cell100 column1">
                        <Link to={'/shop/' + d.id}>{d.name}</Link>
                    </td>
                    <td className="cell100 column2">{d.location}</td>
                    <td className="cell100 column3 right">{d.owner}</td>
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
                            <th className="column2">Location</th>
                            <th className="column3 right">Player</th>
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
