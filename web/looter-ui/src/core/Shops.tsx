import * as React from 'react';
import { Link } from 'react-router-dom';
import RedirectableSearch from './components/RedirectableSearch';
import MyNavigation from './components/MyNavigation';
import Container from './components/Container';
import TableReport from './components/TableReport';
import './Shops.css';

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
        fetch('https://free-ro.kudesnik.cc/rest/shops/all?term=' + encodeURIComponent(this.props.term))
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
        document.title = this.props.term ? 'FreeRO - Shops - ' + this.props.term : 'FreeRO - Shops';

        return (
            <div className="limiter area-shops">
                <MyNavigation active="shops"/>
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
                                        <span>
                                            {d.type === 'sell' ? 'S> ' : 'B> '}
                                            {d.name}
                                        </span>
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
