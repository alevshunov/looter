import * as React from 'react';
import { Link } from 'react-router-dom';
import asPrice from './components/asPrice';
import MyNavigation from './components/MyNavigation';
import Container from './components/Container';
import TableReport from './components/TableReport';
import GA from './extra/GA';
import asShopCount from './components/asShopCount';

interface State {
    loading: boolean;
    data?: Array<any>;
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
        fetch('https://free-ro.kudesnik.cc/rest/shops/with/' + encodeURIComponent(this.props.itemName))
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
        document.title = this.props.itemName ? 'FreeRO - Shops - ' + this.props.itemName : 'FreeRO - Shops';
        GA();

        return (
            <div className="limiter">
                <MyNavigation active="shops"/>
                <Container>
                    <table className="table-report info">
                        <tbody>
                            <tr>
                                <td className="info-item table-report-cell shop-item-name">
                                    {this.props.itemName}
                                    {/*<NavLink to={'/item/history/' + decodeURI(this.props.itemName)}>*/}
                                        {/*История цен*/}
                                    {/*</NavLink>*/}
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
                        data={this.state.data}
                    />
                </Container>
            </div>
        );
    }
}

export default ShopWithItem;
