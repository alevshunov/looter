import * as React from 'react';
import './WoEHistory.css';
import { Link } from 'react-router-dom';
import Container from '../components/Container';
import TableReport from '../components/TableReport';
import asNumber from '../components/asNumber';
import Report24 from '../components/Report24';
import ContainerText from '../components/ContainerText';
import TimeCachedStore from '../extra/TimeCachedStore';
import GA from '../extra/GA';

interface State {
    data?: any;
    state24?: any;
}

interface Props {
    // shopId: number;
}

class WoEHistory extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = { data: undefined };
    }

    componentWillMount() {
        this.doLoad();
    }

    doLoad() {
        const cacheData = TimeCachedStore.instance().get(`/woe/history`);
        if (cacheData) {
            this.setState(cacheData);
            return;
        }

        this.setState({ data: undefined });

        const me = this;
        fetch('/rest/woe/history')
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

                TimeCachedStore.instance().set(`/woe/history`, { state24, data });

                me.setState({ state24, data });
            });
    }

    render() {
        document.title = 'FreeRO - WoE - История';

        GA();

        return (
            <Container userCls="area-woe-hostory">
                <ContainerText>
                    <Report24 data={this.state.state24} title={'График активности за последние 50 ГВ:'}/>
                </ContainerText>
                <div/>
                <TableReport
                    title={'История ГВ'}
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
        );
    }
}

export default WoEHistory;
