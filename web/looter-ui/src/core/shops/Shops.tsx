import * as React from 'react';
import { Link } from 'react-router-dom';
import RedirectableSearch from '../components/RedirectableSearch';
import Container from '../components/Container';
import TableReport from '../components/TableReport';
import './Shops.css';
import GA from '../extra/GA';
import TimeCachedStore from '../extra/TimeCachedStore';

interface State {
    loading: boolean;
    data?: Array<any>;
}

interface Props {
    term: string;
}

class Shops extends React.Component<Props, State> {

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
        this.setState({loading: true});
        const me = this;

        const cacheData = TimeCachedStore.instance().get(`shops/${this.props.term}`);
        if (cacheData) {
            me.setState({ data: cacheData, loading: false });
            return;
        }

        fetch('/rest/shops/all?term=' + encodeURIComponent(this.props.term))
            .then((response) => {
                try {
                    return response.json();
                } catch (e) {
                    return [];
                }
            })
            .then((data) => {
                TimeCachedStore.instance().set(`shops/${me.props.term}`, data);
                me.setState({data, loading: false} );
            });

    }

    render() {
        document.title = this.props.term ? 'FreeRO - Shops - ' + this.props.term : 'FreeRO - Shops';
        GA();

        return (
            <div className="area-shops">
                <Container>
                    <RedirectableSearch base="/shops/" term={this.props.term}/>
                </Container>
                <Container>
                    <TableReport
                        cells={
                            [
                                {
                                    title: 'Название магазина',
                                    field: 'name',
                                    render: (name, d) => (
                                        <div>
                                            <div className="truncate">
                                                {d.type === 'sell' ? 'S> ' : 'B> '}
                                                {d.name}
                                            </div>
                                            <div className="items">
                                                {d.items &&
                                                d.items.split(',').map(
                                                    (id: any) =>
                                                        <img
                                                            key={id}
                                                            className="shadow icon"
                                                            src={'https://img.free-ro.com/item/small/' + id + '.png'}
                                                        />
                                                )
                                                }
                                            </div>
                                        </div>
                                    )
                                },
                                {
                                    title: 'Владелец',
                                    field: 'owner'
                                },
                                {
                                    title: 'Расположение',
                                    field: 'location',
                                    align: 'right',
                                    render: (location, d) =>  <Link to={'/shop/' + d.id}>{d.location}</Link>
                                }
                            ]
                        }
                        data={this.state.data}
                        emptyMessage="Открытых магазинов по данному поиску не найдено."
                    />
                </Container>
            </div>
        );
    }
}

export default Shops;
