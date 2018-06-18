import * as React from 'react';
import './WoEPlayers.css';
import { Link } from 'react-router-dom';
import Container from '../components/Container';
import TableReport from '../components/TableReport';
import asNumber from '../components/asNumber';
import TimeCachedStore from '../extra/TimeCachedStore';
import GA from '../extra/GA';
import ValueWithDelta from '../components/ValueWithDelta';
import asDeltaArrow from '../components/asDeltaArrow';

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
        fetch('/rest/woe/players')
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
                    // title={'Рейтинг ГВ игроков'}
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
                                            <i className={d.mainIcon} title={d.mainName}/>
                                            {' '}
                                            {d.mainName}
                                            {' #'}{d.mainRateIndex}
                                            {asDeltaArrow(d.mainRateDelta)}
                                            <br/>
                                            <i className={d.auxIcon} title={d.auxName}/>
                                            {' '}
                                            {d.auxName}
                                            {' #'}{d.auxRateIndex}
                                            {asDeltaArrow(d.auxRateDelta)}
                                        </div>
                                    </div>
                                )
                            },
                            {
                                title: 'Боев',
                                field: 'woes',
                                align: 'right',
                                render: x => asNumber(x)
                            },
                            {
                                title: 'Убийств',
                                field: 'kills',
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
                                render: (v, d) => (
                                    <ValueWithDelta value={d.playerRate} delta={d.playerRateDelta}/>
                                )
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
