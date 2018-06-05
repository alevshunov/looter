import * as React from 'react';
import * as moment from 'moment';
import RedirectableSearch from './components/RedirectableSearch';
import { NavLink } from 'react-router-dom';
import MyNavigation from './components/MyNavigation';
import InfoOutline from '@material-ui/icons/InfoOutline';
import Container from './components/Container';
import TableReport from './components/TableReport';
import GA from './extra/GA';
import TimeCachedStore from './extra/TimeCachedStore';

interface State {
    loading: boolean;

    data?: Array<{
        card: string;
        owner: string;
        date: Date;
        ids: string;
    }>;
}

interface Props {
    term: string;
}

class Cards extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            data: undefined,
            loading: true
        };

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

        const cacheData = TimeCachedStore.instance().get(`cards/${this.props.term}`);
        if (cacheData) {
            me.setState({ data: cacheData, loading: false });
            return;
        }

        const originalTerm = me.props.term;

        fetch('https://free-ro.kudesnik.cc/rest/cards?term=' + encodeURIComponent(this.props.term))
            .then((response) => {
                try {
                    return response.json();
                } catch (e) {
                    return [];
                }
            })
            .then((data) => {
                if (me.props.term === originalTerm) {
                    TimeCachedStore.instance().set(`cards/${me.props.term}`, data);
                    me.setState({data, loading: false});
                }
            });
    }

    render() {
        document.title = this.props.term ? 'FreeRO - Cards - ' + this.props.term : 'FreeRO - Cards';
        GA();

        return (
            <div className="limiter area-cards">
                <MyNavigation active="cards"/>
                <Container>
                    <RedirectableSearch base="/cards/" term={this.props.term}/>
                </Container>
                <Container>
                    <TableReport
                        cells={
                            [
                                {
                                    title: 'Название карты',
                                    field: 'card',
                                    render: (card, d) => (
                                        <span>
                                            <NavLink to={'/cards/' + d.card}>{d.card}</NavLink>
                                            {' '}
                                            {d.ids &&
                                                <span className="item_db-ids">id: {d.ids}
                                                    <a href={'http://rodb.kudesnik.cc/item/?term=' + d.card}>
                                                        <InfoOutline style={{height: '11px'}}/>
                                                    </a>
                                                </span>
                                            }
                                        </span>
                                    )
                                },
                                {
                                    title: 'Игрок',
                                    field: 'owner',
                                    render: (owner) =>
                                        <NavLink to={'/cards/' + owner}>{owner}</NavLink>

                                },
                                {
                                    title: 'Время',
                                    field: 'date',
                                    align: 'right',
                                    render: (date) => moment(date)
                                        .locale('ru')
                                        .format('DD MMMM YYYY, HH:mm')
                                }
                            ]
                        }
                        data={this.state.data}
                        emptyMessage="Искомую карту никто не выбивал."
                    />
                </Container>
            </div>
        );
    }
}

export default Cards;
