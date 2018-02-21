import * as React from 'react';
import RedirectableSearch from './components/RedirectableSearch';
import { NavLink } from 'react-router-dom';
import asPrice from './components/asPrice';

interface State {
    loading: boolean;

    data: Array<{
        name: string,
        count: number,
        min: number,
        max: number
    }>;
}

interface Props {
    term: string;
}

class AllItems extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = { data: [], loading: true};
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
        fetch('https://free-ro.kudesnik.cc/rest/shops/active?term=' + encodeURIComponent(this.props.term))
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
        document.title = this.props.term ? 'FreeRO - Price - ' + this.props.term : 'FreeRO - Price list';

        return (
            <div className="limiter">
                <RedirectableSearch base="/items/" term={this.props.term}/>
                <table className="table_center">
                    <thead>
                        <tr>
                            <th className="column1">Name</th>
                            <th className="column2">Count</th>
                            <th className="column3 right">Price</th>
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
                                            <a href={'http://rodb.kudesnik.cc/item/?term=' + d.name}>{d.name}</a>
                                        </td>
                                        <td className="cell100 column2">{d.count}</td>
                                        <td className="cell100 column3 right">
                                            <NavLink to={'/shops/with/' + d.name}>{asPrice(d.min, d.max)}</NavLink>
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

export default AllItems;
