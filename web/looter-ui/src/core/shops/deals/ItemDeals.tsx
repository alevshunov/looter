import * as React from 'react';
import GA from '../../extra/GA';
import Container from '../../components/Container';
import asPrice from '../../components/asPrice';
import asDate from '../../components/asDate';
import asNumber from '../../components/asNumber';
import TableReport from '../../components/TableReport';
import { NavLink } from 'react-router-dom';
import './ItemDeals.css';
import DealsNavigation from './DealsNavigation';
import TimeCachedStore from '../../extra/TimeCachedStore';
// import { LineChart } from 'react-chartkick';
import HistoryGraph from './components/HistoryGraph';

interface State {
    data: any;
}

interface Props {
    itemName: string;
    area: string;
}

class ItemDeals extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            data: undefined
        };
    }

    componentWillMount() {
        this.doLoad();
    }

    componentWillReceiveProps(props: Props) {
        setTimeout(this.doLoad.bind(this), 1);
    }

    doLoad() {
        const url = `/rest/item/${encodeURIComponent(this.props.itemName)}/deals`;

        const cacheData = TimeCachedStore.instance().get(url);
        if (cacheData) {
            this.setState({ data: cacheData });
            return;
        }

        fetch(url)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                TimeCachedStore.instance().set(url, data);
                this.setState({ data });
            });
    }

    asObj(arr: any[]) {
        const obj = {};
        arr.forEach((x: any) => obj[x.date] = x.dayPrice);
        return obj;
    }

    render() {
        document.title = this.props.itemName ? 'FreeRO - Item History - ' + this.props.itemName : 'FreeRO - Shops';
        GA();

        if (!this.state.data) {
            return null;
        }

        let data;

        switch (this.props.area) {
            case 'sold':
                data = (
                    <Container>
                        {this.renderDeals('', this.state.data.sold)}
                    </Container>
                );
                break;
            case 'bought':
                data = (
                    <Container>
                        {this.renderDeals('', this.state.data.bought)}
                    </Container>
                );
                break;
            case 'sold-price':
                data = (
                    <Container>
                        {this.renderAvg('', this.state.data.soldPrice)}
                    </Container>
                );
                break;
            case 'bought-price':
                data = (
                    <Container>
                        {this.renderAvg('', this.state.data.boughtPrice)}
                    </Container>
                );
                break;
            default:
                data = '';
        }

        return (
            <div className="area-item-deals">
                <Container>
                    <table className="table-report info">
                        <tbody>
                        <tr>
                            <td className="info-item table-report-cell shop-item-name">
                                {this.props.itemName}
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
                                <NavLink to={'/shops/with/' + decodeURI(this.props.itemName)}>
                                    Найти в продаже
                                </NavLink>
                            </td>
                        </tr>
                        </tbody>
                    </table>

                    <HistoryGraph data={this.state.data} />

                </Container>

                <DealsNavigation itemName={this.props.itemName}/>
                {data}
            </div>
        );
    }

    renderDeals(title: string, deals: any[]) {
        return  (
            <TableReport
                cells={
                    [
                        {
                            title: 'Магазин',
                            field: 'shopName',
                            render: (v, d) => (
                                <NavLink to={'/shop/' + d.shopId}>
                                    {d.shopName || 'NONAME'}
                                </NavLink>
                            )
                        },
                        {
                            title: 'Время сделки',
                            field: 'date',
                            align: 'right',
                            render: (v, d) => (
                                <span>
                                    {asDate(d.dateFrom)} - {asDate(d.dateTo, 'HH:mm')}
                                </span>
                            )
                        },
                        {
                            title: 'Количество',
                            field: 'count',
                            align: 'right',
                            render: (count) => asNumber(count, 'шт')
                        },
                        {
                            title: 'Цена',
                            field: 'price',
                            align: 'right',
                            render: (price, d) => (
                                asPrice(d.price)
                            )
                        }
                    ]
                }
                data={deals}
                emptyMessage="Сделки отсутствуют."
            />
        );
    }

    renderAvg(title: string, data: any[]) {
        return  (
            <TableReport
                cells={
                    [
                        {
                            title: 'Дата',
                            field: 'date',
                            render: (v) => (
                                asDate(v, 'DD MMMM YYYY')
                            )
                        },
                        {
                            title: 'Количество',
                            field: 'soldCount',
                            align: 'right',
                            render: (count) => asNumber(count, 'шт')
                        },
                        {
                            title: 'Средняя цена',
                            field: 'price',
                            align: 'right',
                            render: (price, d) => (
                                <span>
                                    {asPrice(d.dayPrice)}
                                </span>
                            )
                        }
                    ]
                }
                data={data}
                emptyMessage="Сделки отсутствуют."
            />
        );
    }

}

export default ItemDeals;