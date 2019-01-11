import * as React from 'react';
import './ShopItems.css';
import * as moment from 'moment';
import { NavLink } from 'react-router-dom';
import asPrice from '../components/asPrice';
import asShopCount from '../components/asShopCount';
import TableReport from '../components/TableReport';
import Container from '../components/Container';
import GA from '../extra/GA';
import asDate from '../components/asDate';

interface State {
    loading: boolean;

    data?: any;
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
        fetch('/rest/shop/' + this.props.shopId)
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
        const parts = /^.+? <(.+)>$/g.exec(this.state.data.location);
        let location;
        if (parts && parts.length > 1) {
            location = parts[1].replace(',', ' ');
        }

        return (
            <div className="area-shop">
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
                                <td className="info-item table-report-cell">
                                    <NavLink to={'/shops/by/' + this.state.data.owner}>
                                        {this.state.data.owner}
                                    </NavLink>
                                </td>
                            </tr>
                            <tr>
                                <td className="info-item table-report-cell">
                                    {this.state.data.location}
                                </td>
                            </tr>
                            <tr>
                                <td className="info-item table-report-cell">
                                    @show {location}
                                </td>
                            </tr>
                            <tr>
                                <td className="info-item table-report-cell">
                                    {moment(this.state.data.date)
                                    .locale('ru')
                                    .format('DD MMMM YYYY, HH:mm')} -
                                    {' '}{moment(this.state.data.lastFetch)
                                    .locale('ru')
                                    .format('DD MMMM YYYY, HH:mm')}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Container>
                {this.state.data.items &&
                    <Container>
                        <TableReport
                            title="Доступный товар"
                            userCls="items"
                            cells={[
                                {
                                    title: '',
                                    field: 'index'
                                },
                                {
                                    title: 'Наименование',
                                    field: 'name',
                                    render: (name, o) => (
                                        <span>
                                            {/*<span>{shopType === 'sell' ? 'S> ' : 'B> '}</span>*/}
                                            {o.ids &&
                                            <img
                                                className={'icon shadow'}
                                                src={
                                                    'https://img.free-ro.com/item/small/'
                                                    + (o.ids.split(',')[0])
                                                    + '.png'
                                                }
                                            />
                                            }
                                            <NavLink to={'/shops/with/' + o.name}>{o.name}</NavLink>
                                            {o.ids &&
                                                <span className="item_db-ids">id: {o.ids}
                                                    <a href={'http://rodb.kudesnik.cc/item/?term=' + o.name}>
                                                        {/*<InfoOutline style={{height: '11px'}}/>*/}
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
                {this.state.data.soldHistory &&
                <Container>
                    <TableReport
                        userCls="sold-history"
                        title="История сделок"
                        cells={[
                            {
                                title: '',
                                field: 'index'
                            },
                            {
                                title: 'Наименование',
                                field: 'name',
                                render: (name, o) => (
                                    <span>
                                        <NavLink to={'/shops/with/' + o.name}>{o.name}</NavLink>
                                        {o.ids &&
                                            <span className="item_db-ids">id: {o.ids}
                                            <a href={'http://rodb.kudesnik.cc/item/?term=' + o.name}>
                                                    {/*<InfoOutline style={{height: '11px'}}/>*/}
                                                </a>
                                            </span>
                                        }
                                        </span>
                                )
                            },
                            {
                                title: '',
                                field: 'count',
                                align: 'right',
                                render: (count) => asShopCount(count)
                            },
                            {
                                title: '',
                                field: 'price',
                                align: 'right',
                                render: (price) => asPrice(price)
                            },
                            {
                                title: 'Время сделки',
                                field: 'date',
                                align: 'right',
                                render: (v, d) => (
                                    <span>
                                        {asDate(d.intervalEnd, 'HH:mm')}
                                    </span>
                                )
                            }
                        ]}
                        rowExtraClass={(o, index) => o.count.end === 0 ? 'sold' : ''}
                        data={this.state.data.soldHistory}
                    />
                </Container>
                }
            </div>
        );
    }
}

export default ShopItems;
