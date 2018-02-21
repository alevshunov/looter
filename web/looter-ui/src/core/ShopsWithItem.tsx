import * as React from 'react';
import { Link } from 'react-router-dom';
import asPrice from './components/asPrice';

interface State {
    loading: boolean;
    data: Array<any>;
}

interface Props {
    itemName: string;
}

class ShopWithItem extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            data: [],
            loading: false
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
        fetch('https://free-ro.kudesnik.cc/rest/shops/with/' + encodeURIComponent(this.props.itemName))
            .then((response) => {
                try {
                    return response.json();
                } catch (e) {
                    return [];
                }
            })
            .then((data) => {
                me.setState({data} );
            });

    }

    render() {
        document.title = this.props.itemName ? 'FreeRO - Shops - ' + this.props.itemName : 'FreeRO - Shops';

        return (
            <div className="limiter">
                <table className="table_center info">
                    <tbody>
                    <tr>
                        <td className="info-item">{this.props.itemName}</td>
                    </tr>
                    </tbody>
                </table>
                <table className="table_center">
                    <thead>
                        <tr>
                            <th className="column1">Name</th>
                            <th className="column2">Location</th>
                            <th className="column3 right">Player</th>
                            <th className="column4 right">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.data.map((d, index) =>
                                (
                                    <tr key={index}>
                                        <td className="cell100 column1">
                                            <Link to={'/shop/' + d.id}>{d.name}</Link>
                                        </td>
                                        <td className="cell100 column2">
                                            <Link to={'/shop/' + d.id}>{d.location}</Link>
                                        </td>
                                        <td className="cell100 column3 right">{d.owner}</td>
                                        <td className="cell100 column3 right">{asPrice(d.min, d.max)}</td>
                                    </tr>
                                ))
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ShopWithItem;
