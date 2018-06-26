import * as React from 'react';
import TimeCachedStore from '../../extra/TimeCachedStore';
import asPrice from '../../components/asPrice';
import asNumber from '../../components/asNumber';
import GA from '../../extra/GA';
import Container from '../../components/Container';
import RedirectableSearch from '../../components/RedirectableSearch';
import TableReport from '../../components/TableReport';
import { NavLink } from 'react-router-dom';
import { InfoOutline } from '@material-ui/icons';
import asDate from '../../components/asDate';
import './Deals.css';

interface State {
    data?: any;
}

interface Props {
    term: string;
}

class Deals extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = { data: undefined };
        this.doLoad = this.doLoad.bind(this);
    }

    componentWillMount() {
        this.doLoad();
    }

    componentWillReceiveProps(props: Props) {
        setTimeout(this.doLoad, 1);
    }

    doLoad() {
        const me = this;

        const cacheKey = `item/deals/${this.props.term}`;

        const cacheData = TimeCachedStore.instance().get(cacheKey);
        if (cacheData) {
            me.setState({ data: cacheData });
            return;
        }

        const originalTerm = me.props.term;

        let url = `/rest/shops/deals/?term=${encodeURIComponent(this.props.term)}`;

        fetch(url)
            .then((response) => {
                try {
                    return response.json();
                } catch (e) {
                    return [];
                }
            })
            .then((data) => {
                if (originalTerm === me.props.term) {
                    TimeCachedStore.instance().set(cacheKey, data);
                    me.setState({data});
                }
            });

    }

    render() {
        document.title = this.props.term ? 'FreeRO - Deals - ' + this.props.term : 'FreeRO - Deals list';
        GA();

        return (
            <div className="area-deals">
                <Container>
                    <RedirectableSearch base={'/shops/deals/'} term={this.props.term}/>
                </Container>
                <Container>
                    <TableReport
                        userCls={'deals'}
                        cells={
                            [
                                {
                                    title: 'Товар',
                                    field: 'name',
                                    render: (name, d) => (
                                        <span>
                                            {d.type === 'sell' ? 'S>' : 'B>'}
                                            {' '}
                                            <NavLink to={`/item/${encodeURIComponent(d.itemName)}/deals/sold`}>
                                                {d.itemName}
                                            </NavLink>
                                            {' '}
                                            {
                                                d.ids &&
                                                <span className="item_db-ids">id: {d.ids}
                                                    <a href={'http://rodb.kudesnik.cc/item/?term=' + d.itemName}>
                                                        <InfoOutline style={{height: '11px'}}/>
                                                    </a>
                                                </span>
                                            }
                                        </span>
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
                                    title: '',
                                    field: 'count',
                                    align: 'right',
                                    render: (count) => asNumber(count, 'шт')
                                },
                                {
                                    title: '',
                                    field: 'price',
                                    align: 'right',
                                    render: (price, d) => (
                                        <NavLink to={'/shop/' + d.shopId}>{asPrice(d.price)}</NavLink>
                                    )
                                }
                            ]
                        }
                        data={this.state.data}
                        emptyMessage="Сделки отсутствуют."
                    />

                </Container>
            </div>
        );
    }
}

export default Deals;