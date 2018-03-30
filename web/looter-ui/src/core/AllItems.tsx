import * as React from 'react';
import RedirectableSearch from './components/RedirectableSearch';
import { Link, NavLink } from 'react-router-dom';
import asPrice from './components/asPrice';
import MyNavigation from './components/MyNavigation';
import InfoOutline from 'material-ui-icons/InfoOutline';
import Container from './components/Container';
import TableReport from './components/TableReport';
import asNumber from './components/asNumber';
import './AllItems.css';
import GA from './extra/GA';
import TimeCachedStore from './extra/TimeCachedStore';

interface State {
    loading: boolean;

    order: string;

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
}

class AllItems extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = { data: undefined, loading: true, order: 'name' };
    }

    componentWillMount() {
        this.doLoad();
    }

    componentWillReceiveProps(props: Props) {
        setTimeout(this.doLoad.bind(this), 1);
    }

    doLoad() {
        this.setState({loading: true});
        const me = this;

        const cacheData = TimeCachedStore.instance().get(`items/${this.props.term}`);
        if (cacheData) {
            me.setState({ data: cacheData, loading: false });
            return;
        }

        fetch('https://free-ro.kudesnik.cc/rest/shops/active?term='
            + encodeURIComponent(this.props.term)
            + '&order=' + this.state.order)
            .then((response) => {
                try {
                    return response.json();
                } catch (e) {
                    return [];
                }
            })
            .then((data) => {
                TimeCachedStore.instance().set(`items/${me.props.term}`, data);
                me.setState({ data, loading: false });
            });

    }

    render() {
        document.title = this.props.term ? 'FreeRO - Price - ' + this.props.term : 'FreeRO - Price list';
        GA();

        return (
            <div className="limiter area-allitems">
                <MyNavigation active="items"/>
                <Container>
                    <RedirectableSearch base="/items/" term={this.props.term}/>
                </Container>
                <Container>
                    <TableReport
                        cells={
                            [
                                {
                                    // title: 'Название',
                                    title: <Link to={'/items/by/name/' + this.props.term}>Название</Link>,
                                    field: 'name',
                                    render: (name, d) => (
                                        <span>
                                            {d.type === 'sell' ? 'S>' : 'B>'} {d.name}
                                            {' '}
                                            {
                                                d.ids &&
                                                <span className="item_db-ids">id: {d.ids}
                                                    <a href={'http://rodb.kudesnik.cc/item/?term=' + d.name}>
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
                                    render: (count) => asNumber(count, 'шт')
                                },
                                {
                                    title: 'Цена',
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
