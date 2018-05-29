import * as React from 'react';
import './WoEHistory.css';
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
        fetch('http://localhost:9999/rest/woe/players')
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
                    <TableReport
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
                                    title: 'K',
                                    field: 'pk',
                                    align: 'right',
                                    tooltip: 'Kills',
                                    render: x => asNumber(x)
                                },
                                {
                                    title: 'D',
                                    field: 'pd',
                                    align: 'right',
                                    tooltip: 'Deaths',
                                    render: x => asNumber(x)
                                },
                                {
                                    title: 'S',
                                    field: 'ps',
                                    align: 'right',
                                    tooltip: 'Supports',
                                    render: x => asNumber(x)
                                },
                                {
                                    title: 'DB',
                                    field: 'pdb',
                                    align: 'right',
                                    tooltip: 'Debuffs',
                                    render: x => asNumber(x)
                                },
                                {
                                    title: 'Боев',
                                    align: 'right',
                                    field: 'gamesPlayed'
                                },
                                {
                                    title: 'Рейтинг',
                                    field: 'rate',
                                    align: 'right',
                                    render: (value) => asNumber(value, undefined, '0,0.00')
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
