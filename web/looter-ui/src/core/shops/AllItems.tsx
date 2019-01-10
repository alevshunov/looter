import * as React from 'react';
import RedirectableSearch from '../components/RedirectableSearch';
import { Link, NavLink } from 'react-router-dom';
import asPrice from '../components/asPrice';
import Container from '../components/Container';
import TableReport from '../components/TableReport';
import asNumber from '../components/asNumber';
import './AllItems.css';
import GA from '../extra/GA';
import TimeCachedStore from '../extra/TimeCachedStore';

interface State {
    data?: Array<{
        name: string,
        count: number,
        min: number,
        max: number,
        type: string,
        ids: string
    }>;
}

interface Props {
    term: string;
    order: { field: string, direction: string };
}

class AllItems extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = { data: undefined };
    }

    componentWillMount() {
        this.doLoad();
    }

    componentWillReceiveProps(props: Props) {
        setTimeout(this.doLoad.bind(this), 1);
    }

    doLoad() {
        const me = this;

        const cacheKey = `items/${this.props.order.field}/${this.props.order.direction}/${this.props.term}`;

        const cacheData = TimeCachedStore.instance().get(cacheKey);
        if (cacheData) {
            me.setState({ data: cacheData });
            return;
        }

        const parts = [];

        if (this.props.term) {
            parts.push('term=' + encodeURIComponent(this.props.term));
        }

        if (this.props.order) {
            parts.push('order=' + encodeURIComponent(this.props.order.field));
            parts.push('direction=' + encodeURIComponent(this.props.order.direction));
        }

        const originalTerm = me.props.term;

        let url = '/rest/shops/active'
        // let url = 'http://127.0.0.1:9999/rest/shops/active'
            + (parts.length > 0 ? '?' + parts.join('&') : '');

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

    urlForColumn(field: string) {
        if (!this.props.order) {
            return `/items/by/${field}/asc/${this.props.term}`;
        }

        let direction = this.props.order.field === field && this.props.order.direction === 'asc' ? 'desc' : 'asc';

        return `/items/by/${field}/${direction}/${this.props.term}`;
    }

    urlForSearch() {
        if (this.props.order.field === 'default') {
            return `/items/`;
        }

        return `/items/by/${this.props.order.field}/${this.props.order.direction}/`;
    }

    render() {
        document.title = this.props.term ? 'FreeRO - Price - ' + this.props.term : 'FreeRO - Price list';
        GA();

        return (
            <div className="area-allitems">
                <Container>
                    <RedirectableSearch base={this.urlForSearch()} term={this.props.term}/>
                </Container>
                <Container>
                    <TableReport
                        cells={
                            [
                                {
                                    // title: 'Название',
                                    title: (<Link to={this.urlForColumn('name')}>Название</Link>),
                                    field: 'name',
                                    render: (name, d) => (
                                        <span>
                                            {d.type === 'sell' ? 'S>' : 'B>'}
                                            {d.ids &&
                                            <img
                                                className={'icon shadow'}
                                                src={
                                                    'https://img.free-ro.com/item/small/'
                                                    + (d.ids.split(',')[0])
                                                    + '.png'
                                                }
                                            />
                                            }
                                            <span>{d.name}</span>
                                            {' '}
                                            {
                                                d.ids &&
                                                <span className="item_db-ids">id: {d.ids}
                                                    <a href={'http://rodb.kudesnik.cc/item/?term=' + d.name}>
                                                        {/*<InfoOutline style={{height: '11px'}}/>*/}
                                                    </a>
                                                </span>
                                            }
                                        </span>
                                    )
                                },
                                {
                                    // title: 'Количество',
                                    title: (<Link to={this.urlForColumn('count')}>Количество</Link>),
                                    field: 'count',
                                    align: 'right',
                                    render: (count) => asNumber(count, 'шт')
                                },
                                {
                                    // title: 'Цена',
                                    title: (<Link to={this.urlForColumn('price')}>Цена</Link>),
                                    field: 'price',
                                    align: 'right',
                                    render: (price, d) => (
                                        <NavLink to={'/shops/with/' + d.name}>{asPrice(d.min, d.max)}</NavLink>
                                    )
                                }
                            ]
                        }
                        data={this.state.data}
                        emptyMessage="В продаже отсутствует."
                    />

                </Container>
            </div>
        );
    }
}

export default AllItems;
