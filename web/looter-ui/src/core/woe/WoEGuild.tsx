import * as React from 'react';
import GA from '../extra/GA';
import './WoEGuild.css';
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
    guildId: string;
}

class WoEGuild extends React.Component<Props, State> {

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
        fetch('https://free-ro.kudesnik.cc/rest/woe/guild/' + this.props.guildId)
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
        document.title =
            (!this.state.data ? 'FreeRO - WoE - Гильдии' : 'FreeRO - ' + this.state.data.guild.name);

        GA();

        if (!this.state.data) {
            return null;
        }

        return (
            <div className="area-woe-guild">
                <Container>
                    <table className="table-report info">
                        <tbody>
                            <tr>
                                <td className="info-item table-report-cell">
                                    <img src={this.state.data.guild.icon_url} />
                                </td>
                            </tr>
                            <tr>
                                <td className="info-item table-report-cell">
                                    {this.state.data.guild.name}
                                </td>
                            </tr>
                            <tr>
                                <td className="info-item table-report-cell">
                                    Проведено {asNumber(this.state.data.guild.games_played)} ГВ
                                </td>
                            </tr>
                        </tbody>
                    </table>

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
                                    render: (v, d) => asNumber(v)
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
                        userCls={'players'}
                        title={'Состав'}
                        cells={
                            [
                                {
                                    title: '',
                                    field: 'index'
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
                                    title: 'Боев',
                                    align: 'right',
                                    field: 'gamesPlayed'
                                }
                            ]
                        }
                        data={this.state.data.players}
                    />
                </Container>
                <Container>
                    <TableReport
                        userCls={'woes'}
                        title={'История боев'}
                        cells={
                            [
                                {
                                    title: '',
                                    field: 'index'
                                },
                                {
                                    title: 'ГВ',
                                    field: 'name',
                                    render: (name, d) => (
                                        <Link to={`/woe/${encodeURI(d.id)}`}>{name}</Link>
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
                                    title: 'Уши',
                                    align: 'right',
                                    field: 'wings'
                                }
                            ]
                        }
                        data={this.state.data.woes}
                    />
                </Container>
            </div>
        );
    }
}

export default WoEGuild;
