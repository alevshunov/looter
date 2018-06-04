import * as React from 'react';
import './WoEPlayers.css';
import { Link } from 'react-router-dom';
import GA from '../extra/GA';
import MyNavigation from '../components/MyNavigation';
import Container from '../components/Container';
import TableReport from '../components/TableReport';
import asNumber from '../components/asNumber';

interface State {
    loading: boolean;
    data?: any;
    state24?: any;
}

interface Props {
    // shopId: number;
}

class WoEPlayers extends React.Component<Props, State> {

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
        fetch('https://free-ro.kudesnik.cc/rest/woe/players')
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
        document.title = 'FreeRO - WoE - Players';
        GA();

        return (
            <div className="limiter area-woe-players">
                <MyNavigation active="items"/>
                <Container>
                    <table className="table-report info">
                        <tbody>
                            <tr>
                                <td className="info-item table-report-cell">
                                    Посмотреть{' '}
                                    <Link to={'/woe/'}>историю ГВ</Link>{', '}
                                    <Link to={'/woe/guilds/'}>список гильдий</Link>
                                    .
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Container>
                <Container>
                    <TableReport
                        title={'Активные ГВ игроки'}
                        cells={
                            [
                                {
                                    title: '',
                                    field: 'index'
                                },
                                {
                                    title: '',
                                    field: 'guild',
                                    render: (name, d) =>
                                        (
                                            <Link to={`/woe/guild/${d.guildId}/${encodeURIComponent(d.guildName)}`}>
                                                <img src={d.guildIconUrl} title={d.guildName} />
                                            </Link>
                                        )
                                },
                                {
                                    title: 'Игрок',
                                    field: 'name',
                                    render: (name, d) => (
                                        <Link to={`/woe/player/${encodeURI(name)}`}>{name}</Link>
                                    )
                                },
                                {
                                    title: 'Убийств',
                                    field: 'kills',
                                    align: 'right',
                                    tooltip: 'Kills',
                                    render: x => asNumber(x)
                                },
                                {
                                    title: 'Смертей',
                                    field: 'death',
                                    align: 'right',
                                    tooltip: 'Deaths',
                                    render: x => asNumber(x)
                                },
                                {
                                    title: 'Бафы',
                                    field: 'buffs',
                                    align: 'right',
                                    tooltip: 'Supports',
                                    render: x => asNumber(x)
                                },
                                {
                                    title: 'Дебафы',
                                    field: 'debuffs',
                                    align: 'right',
                                    tooltip: 'Debuffs',
                                    render: x => asNumber(x)
                                },
                                {
                                    title: 'Боев',
                                    align: 'right',
                                    field: 'gamesPlayed',
                                    tooltip: 'За 10 ГВ / Всего',
                                    render: (v, d) => <span>{asNumber(d.woes)} / {asNumber(v)}</span>
                                }
                            ]
                        }
                        data={this.state.data}
                        emptyMessage="Данные отсутствуют"
                    />

                </Container>
            </div>
        );
    }
}

export default WoEPlayers;
