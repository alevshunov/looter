import * as React from 'react';
import './WoEHistory.css';
import { Link } from 'react-router-dom';
import GA from '../extra/GA';
import MyNavigation from '../components/MyNavigation';
import Container from '../components/Container';
import TableReport from '../components/TableReport';
import asNumber from '../components/asNumber';
import Report24 from '../components/Report24';
import ContainerText from '../components/ContainerText';

interface State {
    loading: boolean;
    data?: any;
    state24?: any;
}

interface Props {
    // shopId: number;
}

class WoEHistory extends React.Component<Props, State> {

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
        fetch('https://free-ro.kudesnik.cc/rest/woe/history')
            .then((response) => {
                try {
                    return response.json();
                } catch (e) {
                    return [];
                }
            })
            .then((data) => {
                const past = 50;
                const state24 = [];
                let maxActivity = 1;
                for (let i = 0; i < past; i++) {
                    state24[past - 1 - i] = data[i].rate;
                    maxActivity = Math.max(maxActivity, data[i].rate);
                }

                for (let i = 0; i < past; i++) {
                    state24[i] = 100 * state24[i] / maxActivity;
                }

                me.setState({ state24, data, loading: false });
            });
    }

    render() {
        document.title = 'FreeRO - WoE - History';
        GA();

        return (
            <div className="limiter area-woe-hostory">
                <MyNavigation active="items"/>
                <Container>
                    <ContainerText>
                        <Report24 data={this.state.state24} title={'График активности за последнии 50 ГВ:'}/>
                    </ContainerText>
                    <div/>
                    <TableReport
                        cells={
                            [
                                {
                                    // title: 'Название',
                                    title: '',
                                    field: 'name',
                                    render: (name, d) => (<Link to={`/woe/${d.id}`}>{name}</Link>)
                                },
                                {
                                    title: 'Убийст',
                                    field: 'pk',
                                    align: 'right',
                                    render: x => asNumber(x)
                                },
                                {
                                    title: 'Урон',
                                    field: 'pdmg',
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
                        data={this.state.data}
                        emptyMessage="Данные отсутствуют"
                    />

                </Container>
            </div>
        );
    }
}

export default WoEHistory;
