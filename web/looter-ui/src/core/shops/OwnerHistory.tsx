import * as React from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/Container';
import TableReport from '../components/TableReport';
import GA from '../extra/GA';
import TimeCachedStore from '../extra/TimeCachedStore';
import * as moment from 'moment';

interface State {
    loading: boolean;
    data?: Array<any>;
}

interface Props {
    owner: string;
}

class OwnerHistory extends React.Component<Props, State> {

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

        const cacheData = TimeCachedStore.instance().get(`shops/by/${this.props.owner}`);
        if (cacheData) {
            me.setState({ data: cacheData, loading: false });
            return;
        }

        fetch('/rest/shops/by/' + encodeURIComponent(this.props.owner))
            .then((response) => {
                try {
                    return response.json();
                } catch (e) {
                    return [];
                }
            })
            .then((data) => {
                TimeCachedStore.instance().set(`shops/by/${me.props.owner}`, data);
                me.setState({data, loading: false} );
            });

    }

    render() {
        document.title = this.props.owner ? 'FreeRO - Shops - ' + this.props.owner : 'FreeRO - Shops';
        GA();

        return (
            <div className="area-shops">
                <Container>
                    <table className="table-report info">
                        <tbody>
                        <tr>
                            <td className="info-item table-report-cell shop-item-name">
                                История торговца {this.props.owner}
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
                                    title: 'Дата открытия',
                                    field: 'date',
                                    render: (date, d) => (
                                        <span>
                                            {moment(d.date)
                                                .locale('ru')
                                                .format('DD MMMM YYYY, HH:mm')}
                                        </span>
                                    )
                                },
                                {
                                    title: 'Статус',
                                    field: 'active',
                                    render: (active) => (
                                        <span>
                                            {active ? 'Открыт' : 'Закрыт'}
                                        </span>
                                    )
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
                        emptyMessage="Магазинов по данному владельцу не найдено."
                    />
                </Container>
            </div>
        );
    }
}

export default OwnerHistory;
