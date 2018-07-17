import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import asPrice from '../components/asPrice';
import Container from '../components/Container';
import TableReport from '../components/TableReport';
import GA from '../extra/GA';
import asShopCount from '../components/asShopCount';
import './ShopsWithItem.css';

interface State {
    loading: boolean;
    data?: {
        item?: any,
        shops: Array<any>
    };
}

interface Props {
    itemName: string;
}

class ShopWithItem extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            data: undefined,
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
        this.setState({loading: true, data: undefined});

        const me = this;
        fetch('/rest/shops/with/' + encodeURIComponent(this.props.itemName))
            .then((response) => {
                try {
                    return response.json();
                } catch (e) {
                    return [];
                }
            })
            .then((data) => {
                me.setState({data, loading: false} );
            });

    }

    render() {
        if (!this.state.data) {
            return null;
        }

        document.title = this.props.itemName ? 'FreeRO - Shops - ' + this.props.itemName : 'FreeRO - Shops';
        GA();

        const data = this.state.data;

        return (
            <div className="area-shop-with-item">
                <Container>
                    <table className="table-report info">
                        <tbody>
                            <tr>
                                <td className="info-item table-report-cell shop-item-name">
                                    {this.props.itemName}
                                </td>
                            </tr>
                            <tr>
                                <td className="info-item table-report-cell">
                                    {data.item && !(data.item.id >= 4001 && data.item.id <= 4455)
                                    && <img src={'https://img.free-ro.com/item/big/' + data.item.id + '.png'} />
                                    }
                                    {data.item && (data.item.id >= 4001 && data.item.id <= 4455)
                                    &&
                                    <div className="crop">
                                        <img src={'/img/cards/large/' + data.item.id + '.png'} />
                                    </div>
                                    }
                                </td>
                            </tr>
                            <tr>
                                <td className="table-report-cell center">
                                    <a href={'http://rodb.kudesnik.cc/item/?term=' + this.props.itemName}>
                                        Подробнее
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <td className="table-report-cell center">
                                    <NavLink to={'/item/' + decodeURI(this.props.itemName) + '/deals/sold'}>
                                        История цен
                                    </NavLink>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Container>

                <Container>
                    <TableReport
                        cells={
                            [
                                {
                                    title: 'Магазин',
                                    field: 'name',
                                    render: (name, d) => (
                                        <span>{d.type === 'sell' ? 'S> ' : 'B> '}{d.name}</span>
                                    )
                                },
                                {
                                    title: 'Количество',
                                    field: 'count',
                                    align: 'right',
                                    render: (count) => asShopCount(count)
                                },
                                {
                                    title: 'Цена',
                                    field: 'price',
                                    align: 'right',
                                    render: (price, d) => asPrice(d.min, d.max)
                                },
                                {
                                    title: 'Расположение',
                                    field: 'location',
                                    align: 'right',
                                    render: (price, d) => <Link to={'/shop/' + d.id}>{d.location}</Link>
                                },
                            ]
                        }
                        emptyMessage="Отсутствуют магазины с этим предметом"
                        data={data.shops}
                    />
                </Container>
            </div>
        );
    }
}

export default ShopWithItem;
