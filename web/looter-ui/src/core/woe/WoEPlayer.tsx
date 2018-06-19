import * as React from 'react';
import './WoEPlayer.css';
import Container from '../components/Container';
import TableReport from '../components/TableReport';
import asNumber from '../components/asNumber';
import GA from '../extra/GA';
import TextIcon from '../components/TextIcon';
import ValueWithDelta from '../components/ValueWithDelta';
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
        fetch('/rest/woe/player/' + this.props.playerName)
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
        document.title = (!this.state.data ? 'FreeRO - WoE - Игроки' : 'FreeRO - ' + this.state.data.player.name);

        GA();

        if (!this.state.data) {
            return null;
        }

        const guild = this.state.data.guild;
        const player = this.state.data.player;

        return (
            <div className="area-woe-player">
                <Container>
                    <table className="table-report info">
                        <tbody>
                            <tr>
                                <td className="info-item table-report-cell">
                                    <TextIcon
                                        linkUrl={
                                            `/woe/guild/${guild.id}/${encodeURIComponent(guild.name)}`}
                                        iconUrl={guild.iconUrl}
                                    >
                                            {player.name} #{asNumber(player.rateIndex)}
                                    </TextIcon>
                                </td>
                            </tr>
                            <tr>
                                <td className="info-item table-report-cell rate-area">
                                    {'Рейтинг: '}
                                    <ValueWithDelta
                                        value={player.rate}
                                        delta={player.rateDelta}
                                        index={player.rateIndex}
                                    />
                                    {' = '}
                                    <i className={player.mainAttributeIcon}/>
                                    <ValueWithDelta
                                        value={player.mainRate}
                                        delta={player.mainRateDelta}
                                        index={player.mainRateIndex}
                                    />
                                    {' && '}
                                    <i className={player.auxAttributeIcon}/>
                                    <ValueWithDelta
                                        value={player.auxRate}
                                        delta={player.auxRateDelta}
                                        index={player.auxRateIndex}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className="info-item table-report-cell">
                                    <i className={player.mainAttributeIcon}/> {player.mainAttributeName}
                                </td>
                            </tr>
                            <tr>
                                <td className="info-item table-report-cell">
                                    <i className={player.auxAttributeIcon}/> {player.auxAttributeName}
                                </td>
                            </tr>
                            <tr>
                                <td className="info-item table-report-cell">
                                    Проведено {player.gamesPlayed} ГВ
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Container>
                <Container>
                    <TableReport
                        userCls={'common'}
                        cells={
                            [
                                {
                                    title: '',
                                    field: 'name'
                                },
                                {
                                    title: 'В среднем',
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
                <Container>
                    <TableReport
                        userCls={'woes'}
                        title={'Последняя активность'}
                        cells={
                            [
                                {
                                    title: '',
                                    field: 'name',
                                    render: (name, d) => (
                                        <TextIcon
                                            linkUrl={`/woe/guild/${d.guildId}/${encodeURIComponent(d.guildName)}`}
                                            iconUrl={d.guildIconUrl}
                                        >
                                            <Link to={`/woe/${d.id}`}>
                                                {name}
                                            </Link>
                                        </TextIcon>
                                    )
                                },
                                {
                                    title: 'Убил',
                                    field: 'pk',
                                    align: 'right',
                                    render: x => asNumber(x)
                                },
                                {
                                    title: 'Убит',
                                    field: 'pd',
                                    align: 'right',
                                    render: x => asNumber(x)
                                },
                                {
                                    title: 'Нанес урон',
                                    field: 'pdmg',
                                    align: 'right',
                                    render: x => asNumber(x)
                                },
                                {
                                    title: 'Получил урон',
                                    field: 'pdmgget',
                                    align: 'right',
                                    render: x => asNumber(x)
                                },
                                {
                                    title: 'Баф',
                                    field: 'ps',
                                    align: 'right',
                                    render: x => asNumber(x)
                                },
                                {
                                    title: 'Дебаф',
                                    field: 'pdb',
                                    align: 'right',
                                    render: x => asNumber(x)
                                }
                            ]
                        }
                        data={this.state.data.woe}
                        emptyMessage="Данные отсутствуют"
                    />
                </Container>
                <Container>
                    <TableReport
                        userCls="rate-history"
                        rowExtraClass={(d) => (d.active ? 'is-active' : 'is-inactive')}
                        title="История рейтинга"
                        cells={
                            [
                                {
                                    title: 'ГВ',
                                    field: 'woeName',
                                    render: (name, d) => (
                                        <TextIcon
                                            linkUrl={`/woe/guild/${d.guildId}/${encodeURIComponent(d.guildName)}`}
                                            iconUrl={d.guildIconUrl}
                                        >
                                            <Link to={`/woe/${d.woeId}`}>
                                                {name}
                                            </Link>
                                        </TextIcon>
                                    )
                                },
                                {
                                    title: '',
                                    field: 'rate main',
                                    align: 'right',
                                    render: (v, d) => (
                                        <span>
                                            <i className={d.mainIcon} />
                                            {' '}
                                            <ValueWithDelta
                                                value={d.mainRate}
                                                delta={d.mainRateDelta}
                                                index={d.mainRateIndex}
                                            />
                                        </span>
                                    )
                                },
                                {
                                    title: '',
                                    field: 'rate aux',
                                    align: 'right',
                                    render: (v, d) => (
                                        <span>
                                            <i className={d.auxIcon} />
                                            {' '}
                                            <ValueWithDelta
                                                value={d.auxRate}
                                                delta={d.auxRateDelta}
                                                index={d.auxRateIndex}
                                            />
                                        </span>
                                    )
                                },
                                {
                                    title: 'Рейтинг',
                                    field: 'rate',
                                    align: 'right',
                                    render: (v, d) => (
                                        <ValueWithDelta
                                            value={d.playerRate}
                                            delta={d.playerRateDelta}
                                            index={d.playerRateIndex}
                                        />
                                    )
                                }
                            ]
                        }
                        data={this.state.data.rates}
                        emptyMessage="Данные отсутствуют"
                    />
                </Container>
            </div>
        );
    }
}

export default WoEPlayer;
