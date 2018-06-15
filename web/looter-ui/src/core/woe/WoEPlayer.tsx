import * as React from 'react';
import './WoEPlayer.css';
import Container from '../components/Container';
import TableReport from '../components/TableReport';
import asNumber from '../components/asNumber';
import { Link } from 'react-router-dom';
import GA from '../extra/GA';
import TextIcon from '../components/TextIcon';
import ValueWithDelta from '../components/ValueWithDelta';

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
        // fetch('https://free-ro.kudesnik.cc/rest/woe/player/' + this.props.playerName)
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
                                    {' + '}
                                    <i className={player.auxAttributeIcon}/>
                                    <ValueWithDelta
                                        value={player.auxRate}
                                        delta={player.auxRateDelta}
                                        index={player.auxRateIndex}
                                    />
                                    {' * 15%'}
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
                }
                {this.state.data &&
                <Container>
                    <TableReport
                        cells={
                            [
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
                                    title: '',
                                    field: 'name',
                                    render: (name, d) => (<Link to={`/woe/${d.id}`}>{name}</Link>)
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
                }
            </div>
        );
    }
}

export default WoEPlayer;
