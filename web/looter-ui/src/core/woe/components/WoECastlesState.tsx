import * as React from 'react';
import './WoECastlesState.css';
import * as moment from 'moment';
import { Link } from 'react-router-dom';
import TableReport from '../../components/TableReport';
import TextIcon from '../../components/TextIcon';
import TimeCachedStore from '../../extra/TimeCachedStore';

interface State {
    data?: any;
}

interface Props {
    // shopId: number;
}

class WoECastlesState extends React.Component<Props, State> {

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
        fetch('/rest/woe/castles')
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
        return (
            <TableReport
                userCls={'area-castles'}
                // title={'Состояние замков'}
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
        );
    }
}

export default WoECastlesState;