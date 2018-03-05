import * as React from 'react';
import './ShopItems.css';
import * as moment from 'moment';
import { NavLink } from 'react-router-dom';
import asPrice from './components/asPrice';
import MyNavigation from './components/MyNavigation';
import InfoOutline from 'material-ui-icons/InfoOutline';
import asShopCount from './components/asShopCount';
import TableReport from './components/TableReport';
import Container from './components/Container';
import GA from './extra/GA';

interface State {
    loading: boolean;

    data?: {
        items: Array<{
            name: string;
            count: { start: number, end: number };
            price: number;
            ids: string;
        }>;
        name: string;
        location: string;
        owner: string;
        lastFetch: Date;
        date: Date;
        active: boolean;
        type: string;
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
        GA();

        if (!this.state.data) {  return null; }

        const shopType = this.state.data.type;

        return (
            <div className="limiter">
                <MyNavigation active="shops"/>
                <Container>
                    <table className="table-report info">
                        <tbody>
                            {
                                !this.state.data.active && <tr>
                                    <td className="info-item shop-closed table-report-cell">
                                        Магазин закрыт
                                    </td>
                                </tr>
                            }

                            {
                                !!this.state.data.active && <tr>
                                    <td className="info-item shop-opened table-report-cell">
                                        Магазин открыт
                                    </td>
                                </tr>
                            }

                            <tr>
                                <td className="info-item table-report-cell">
                                    {this.state.data.type === 'sell' ? 'S> ' : 'B> '}
                                    {this.state.data.name}
                                    </td>
                            </tr>
                            <tr>
                                <td className="info-item table-report-cell">{this.state.data.owner}</td>
                            </tr>
                            <tr>
                                <td className="info-item table-report-cell">{this.state.data.location}</td>
                            </tr>
                            <tr>
                                <td className="info-item table-report-cell">
                                    {moment(this.state.data.date).format('DD-MM-YYYY, HH:mm')} -{' '}
                                    {moment(this.state.data.lastFetch).format('DD-MM-YYYY, HH:mm')}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Container>

                {this.state.loading && <tr><td className="cell100 column1">Загрузка ...</td></tr>}
                {!this.state.loading && (!this.state.data.items || this.state.data.items.length === 0)
                && <tr><td className="cell100 column1">Данные отсутствуют.</td></tr>}

                {this.state.data.items &&
                    <Container>
                        <TableReport
                            cells={[
                                {
                                    title: '',
                                    field: 'index'
                                },
                                {
                                    title: 'Доступный товар',
                                    field: 'name',
                                    render: (name, o) => (
                                        <span>
                                            <span>{shopType === 'sell' ? 'S> ' : 'B> '}</span>
                                            <NavLink to={'/shops/with/' + o.name}>{o.name}</NavLink>
                                            {o.ids &&
                                                <span className="item_db-ids">id: {o.ids}
                                                    <a href={'http://rodb.kudesnik.cc/item/?term=' + o.name}>
                                                        <InfoOutline style={{height: '11px'}}/>
                                                    </a>
                                                </span>
                                            }
                                        </span>
                                    )
                                },
                                {
                                    title: 'Количество',
                                    field: 'count',
                                    align: 'right',
                                    render: (count) => asShopCount(
                                        count.start,
                                        count.end,
                                        shopType === 'sell' ? 'проданы' : 'куплены'
                                    )
                                },
                                {
                                    title: 'Цена',
                                    field: 'price',
                                    align: 'right',
                                    render: (price) => asPrice(price)
                                }
                            ]}
                            rowExtraClass={(o, index) => o.count.end === 0 ? 'sold' : ''}
                            data={this.state.data.items}
                        />
                    </Container>
                }
            </div>
        );
    }
}

export default ShopItems;
