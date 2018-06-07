import * as React from 'react';
import './WoECastles.css';
import * as moment from 'moment';
import { Link } from 'react-router-dom';
import GA from '../extra/GA';
import MyNavigation from '../components/MyNavigation';
import Container from '../components/Container';
import TableReport from '../components/TableReport';
// import asNumber from '../components/asNumber';
import TimeCachedStore from '../extra/TimeCachedStore';
import WoENavigation from './WoENavigation';
import TextIcon from '../components/TextIcon';

interface State {
    data?: any;
}

interface Props {
    // shopId: number;
}

class WoECastles extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = { data: undefined };
    }

    componentWillMount() {
        this.doLoad();
    }

    doLoad() {
        const cacheData = TimeCachedStore.instance().get('/woe/castles');
        if (cacheData) {
            this.setState(cacheData);
            return;
        }

        this.setState({ data: undefined });

        const me = this;
        fetch('https://free-ro.kudesnik.cc/rest/woe/castles')
            .then((response) => {
                try {
                    return response.json();
                } catch (e) {
                    return [];
                }
            })
            .then((data) => {
                TimeCachedStore.instance().set('/woe/castles', { data });
                me.setState({ data });
            });
    }

    render() {
        document.title = 'FreeRO - WoE - Замки';
        GA();

        return (
            <div className="limiter area-woe-castles">
                <MyNavigation active="items"/>
                <WoENavigation/>
                <Container>
                    <TableReport
                        userCls={'castles'}
                        title={'Состояние замков'}
                        cells={
                            [
                                {
                                    title: '',
                                    field: 'castle-icon',
                                    render: () => <i className="fab fa-fort-awesome"/>
                                },
                                {
                                    title: 'Замок',
                                    field: 'castleName',
                                    render: (c, d) => (
                                        <div>
                                            <div className={'name'}>{d.castleName}</div>
                                            <div className={'location'}>{d.castleLocation}</div>
                                        </div>
                                    )
                                },
                                {
                                    title: 'Гильдия',
                                    field: 'guildName',
                                    render: (name, d) => (
                                        <div>
                                            <TextIcon
                                                linkUrl={`/woe/guild/${d.guildId}/${encodeURIComponent(d.guildName)}`}
                                                iconUrl={d.guildIconUrl}
                                            >
                                                <Link
                                                    to={`/woe/guild/${d.guildId}/${encodeURI(name)}`}
                                                    className={'guild-name'}
                                                >
                                                    {name}
                                                </Link>
                                            </TextIcon>
                                            <div className={'description'}>
                                                {'Империум разбил '}
                                                <Link to={`/woe/player/${encodeURIComponent(d.playerName)}`}>
                                                    {d.playerName}
                                                </Link>
                                                {' на '}
                                                <Link to={`/woe/${encodeURIComponent(d.woeId)}`}>
                                                    {d.woeName}
                                                </Link>
                                            </div>
                                        </div>
                                    )
                                },
                                {
                                    title: 'Владеют',
                                    field: 'date',
                                    align: 'right',
                                    render: (v) => moment(v)
                                        .locale('ru')
                                        .fromNow(true)
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

export default WoECastles;