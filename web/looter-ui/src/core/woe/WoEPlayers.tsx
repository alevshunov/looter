import * as React from 'react';
import './WoEPlayers.css';
import { Link } from 'react-router-dom';
import GA from '../extra/GA';
import MyNavigation from '../components/MyNavigation';
import Container from '../components/Container';
import TableReport from '../components/TableReport';
import asNumber from '../components/asNumber';
import TimeCachedStore from '../extra/TimeCachedStore';
import WoENavigation from './WoENavigation';

interface State {
    data?: any;
    state24?: any;
}

interface Props {
    // shopId: number;
}

class WoEPlayers extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = { data: undefined };
    }

    componentWillMount() {
        this.doLoad();
    }

    doLoad() {

        const cacheData = TimeCachedStore.instance().get('/woe/players');
        if (cacheData) {
            this.setState(cacheData);
            return;
        }

        this.setState({ data: undefined });

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
                TimeCachedStore.instance().set('/woe/players', { data });
                me.setState({ data });
            });
    }

    render() {
        document.title = 'FreeRO - WoE - Players';
        GA();

        return (
            <div className="limiter area-woe-players">
                <MyNavigation active="items"/>
                <WoENavigation active="players"/>
                <Container>
                    <TableReport
                        title={'Активные ГВ игроки по итогам 10 ГВ'}
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
                                    render: (v, d) => asNumber(d.woes)
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
