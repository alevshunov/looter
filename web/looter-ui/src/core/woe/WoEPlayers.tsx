import * as React from 'react';
import './WoEPlayers.css';
import { Link } from 'react-router-dom';
import Container from '../components/Container';
import TableReport from '../components/TableReport';
import asNumber from '../components/asNumber';
import TimeCachedStore from '../extra/TimeCachedStore';
import GA from '../extra/GA';

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
        document.title = 'FreeRO - WoE - Игроки';

        GA();

        return (
            <Container userCls="area-woe-players">
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
                                    <div>
                                        <Link to={`/woe/player/${encodeURI(name)}`}>{name}</Link>
                                        <div className="perks">
                                            <i className={d.playerSpec1Icon} title={d.playerSpec1Name}/>
                                            {' '}
                                            {d.playerSpec1Name}
                                            <br/>
                                            <i className={d.playerSpec2Icon} title={d.playerSpec2Name}/>
                                            {' '}
                                            {d.playerSpec2Name}
                                        </div>
                                    </div>
                                )
                            },
                            {
                                title: 'Убийств',
                                field: 'kills',
                                align: 'right',
                                render: x => asNumber(x)
                            },
                            {
                                title: 'Смертей',
                                field: 'death',
                                align: 'right',
                                render: x => asNumber(x)
                            },
                            {
                                title: 'Бафы',
                                field: 'buffs',
                                align: 'right',
                                render: x => asNumber(x)
                            },
                            {
                                title: 'Дебафы',
                                field: 'debuffs',
                                align: 'right',
                                render: x => asNumber(x)
                            },
                            {
                                title: 'Рейтинг',
                                align: 'right',
                                field: 'rate',
                                render: (v, d) => asNumber(v)
                            }
                        ]
                    }
                    data={this.state.data}
                    emptyMessage="Данные отсутствуют"
                />

            </Container>
        );
    }
}

export default WoEPlayers;
