import * as React from 'react';
import './ShopItems.css';
import * as moment from 'moment';
import { NavLink } from 'react-router-dom';
import asPrice from './components/asPrice';
import MyNavigation from './components/MyNavigation';

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
        lastFetch: Date;
        active: boolean;
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
                <MyNavigation active="shops"/>
                <div>
                    <table className="table_center info">
                        <tbody>
                            {
                                !this.state.data.active && <tr>
                                    <td className="info-item shop-closed">
                                        Магазин закрыт
                                    </td>
                                </tr>
                            }

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
                                    {moment(this.state.data.lastFetch).format('DD-MM-YYYY, HH:mm')}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <table className="table_center">
                    <thead>
                        <tr>
                            <th className="column1">Название</th>
                            <th className="column2">Количество</th>
                            <th className="column3 right">Цена</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.loading && <tr><td className="cell100 column1">Загрузка ...</td></tr>}
                        {!this.state.loading && (!this.state.data.items || this.state.data.items.length === 0)
                            && <tr><td className="cell100 column1">Данные отсутствуют.</td></tr>}
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
