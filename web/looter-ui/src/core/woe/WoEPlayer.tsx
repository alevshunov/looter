import * as React from 'react';
import './WoEHistory.css';
import GA from '../extra/GA';
import MyNavigation from '../components/MyNavigation';
import Container from '../components/Container';
import TableReport from '../components/TableReport';
import asNumber from '../components/asNumber';
import { Link } from 'react-router-dom';

interface State {
    loading: boolean;
    data?: any;
    state24?: any;
}

interface Props {
    playerName: string;
}

class WoEPlayer extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = { data: undefined, loading: false };
    }

    componentWillMount() {
        this.doLoad();
    }

    doLoad() {
        this.setState({loading: true});

        const me = this;
        fetch('http://localhost:9999/rest/woe/player/' + this.props.playerName)
            .then((response) => {
                try {
                    return response.json();
                } catch (e) {
                    return [];
                }
            })
            .then((data) => {
                me.setState({ data, loading: false });
            });
    }

    render() {
        document.title = (!this.state.data ? 'FreeRO - WoE - Player' : 'FreeRO - WoE - ' + this.state.data.player.name);

        GA();

        return (
            <div className="limiter area-woe-player">
                <MyNavigation active="woe"/>
                <Container>
                    <table className="table-report info">
                        <tbody>
                            <tr>
                                <td className="info-item table-report-cell">
                                    {this.state.data && this.state.data.player.name}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Container>
                {this.state.data &&
                    <Container>
                        <TableReport
                            cells={
                                [
                                    {
                                        title: '',
                                        field: 'name'
                                    },
                                    {
                                        title: 'Среднее',
                                        align: 'right',
                                        field: 'avg',
                                        render: (v, d) => asNumber(
                                            d.sum / this.state.data.woe.length)
                                    },
                                    {
                                        title: 'Максимум',
                                        align: 'right',
                                        field: 'max',
                                        render: (v) => asNumber(v)
                                    },
                                    {
                                        title: 'Всего',
                                        align: 'right',
                                        field: 'sum',
                                        render: (v) => asNumber(v)
                                    }
                                ]
                            }
                            data={this.state.data.rate}
                        />
                    </Container>
                }
                {this.state.data &&
                <Container>
                    <TableReport
                        cells={
                            [
                                {
                                    title: '',
                                    field: 'name',
                                    render: (name, d) => (<Link to={`/woe/${d.id}`}>{name}</Link>)
                                },
                                {
                                    title: 'Убил',
                                    field: 'pk',
                                    align: 'right',
                                    tooltip: 'Kills',
                                    render: x => asNumber(x)
                                },
                                {
                                    title: 'Убит',
                                    field: 'pd',
                                    align: 'right',
                                    tooltip: 'Deaths',
                                    render: x => asNumber(x)
                                },
                                {
                                    title: 'Баф',
                                    field: 'ps',
                                    align: 'right',
                                    tooltip: 'Supports',
                                    render: x => asNumber(x)
                                },
                                {
                                    title: 'Дебаф',
                                    field: 'pdb',
                                    align: 'right',
                                    tooltip: 'Debuffs',
                                    render: x => asNumber(x)
                                }
                            ]
                        }
                        data={this.state.data.woe}
                        emptyMessage="Данные отсутствуют"
                    />
                </Container>
                }
            </div>
        );
    }
}

export default WoEPlayer;
