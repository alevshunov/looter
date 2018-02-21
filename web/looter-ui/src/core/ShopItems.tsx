import * as React from 'react';
import './ShopItems.css';
import * as moment from 'moment';
import { NavLink } from 'react-router-dom';
import asPrice from './components/asPrice';

interface State {
    loading: boolean;

    data?: {
        items: Array<{
            name: string,
            count: number,
            price: number
        }>;
        name: string;
        location: string;
        owner: string;
        date: Date;
    };
}

interface Props {
    shopId: number;
}

class ShopItems extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {loading: true};
    }

    updateSearch() {
        this.setState({loading: true});

        const me = this;
        fetch('https://free-ro.kudesnik.cc/rest/shop/' + this.props.shopId)
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
        document.title = this.props.shopId ? 'FreeRO - Shops - #' + this.props.shopId : 'FreeRO - Shops';

        if (!this.state.data) {  return null; }

        return (
            <div className="limiter">
                <div>
                    <table className="table_center info">
                        <tbody>
                            <tr>
                                <td className="info-item">{this.state.data.name}</td>
                            </tr>
                            <tr>
                                <td className="info-item">{this.state.data.owner}</td>
                            </tr>
                            <tr>
                                <td className="info-item">{this.state.data.location}</td>
                            </tr>
                            <tr>
                                <td className="info-item">
                                    {moment(this.state.data.date).format('DD-MM-YYYY, HH:mm')}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <table className="table_center">
                    <thead>
                        <tr>
                            <th className="column1">Name</th>
                            <th className="column2">Count</th>
                            <th className="column3 right">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.loading && <tr><td>Loading ...</td></tr>}
                        {!this.state.loading && (!this.state.data.items || this.state.data.items.length === 0)
                            && <tr><td>No data.</td></tr>}
                        {
                            this.state.data.items.map((d, index) =>
                                (
                                    <tr key={index}>
                                        <td className="cell100 column1">
                                            <NavLink to={'/shops/with/' + d.name}>{d.name}</NavLink>
                                        </td>
                                        <td className="cell100 column2">{d.count}</td>
                                        <td className="cell100 column3 right">{asPrice(d.price)}</td>
                                    </tr>
                                ))
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ShopItems;
