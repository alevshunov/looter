import * as React from 'react';
import './WoEGuilds.css';
import { Link } from 'react-router-dom';
import Container from '../components/Container';
import TableReport from '../components/TableReport';
import asNumber from '../components/asNumber';
import TimeCachedStore from '../extra/TimeCachedStore';
import GA from '../extra/GA';

interface State {
    data?: any;
}

interface Props {
    // shopId: number;
}

class WoEGuilds extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = { data: undefined };
    }

    componentWillMount() {
        this.doLoad();
    }

    doLoad() {
        const cacheData = TimeCachedStore.instance().get('/woe/guilds');
        if (cacheData) {
            this.setState(cacheData);
            return;
        }

        this.setState({ data: undefined });

        const me = this;
        fetch('/rest/woe/guilds')
            .then((response) => {
                try {
                    return response.json();
                } catch (e) {
                    return [];
                }
            })
            .then((data) => {
                TimeCachedStore.instance().set('/woe/guilds', { data });
                me.setState({ data });
            });
    }

    render() {
        document.title = 'FreeRO - WoE - Гильдии';

        GA();

        return (
            <Container userCls="area-woe-guilds">
                <TableReport

                    // title={'ГВ гильдии'}
                    cells={
                        [
                            {
                                title: '',
                                field: 'index'
                            },
                            {
                                title: '',
                                field: 'guild-icon',
                                render: (name, d) =>
                                    (
                                        <Link to={`/woe/guild/${d.id}/${encodeURIComponent(d.name)}`}>
                                            <img src={d.iconUrl} title={d.guildName} />
                                        </Link>
                                    )
                            },
                            {
                                title: 'Гильдия',
                                field: 'name',
                                render: (name, d) => (
                                    <Link to={`/woe/guild/${d.id}/${encodeURI(name)}`}>{name}</Link>
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
                                title: 'Боев',
                                align: 'right',
                                field: 'woes'
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

export default WoEGuilds;
