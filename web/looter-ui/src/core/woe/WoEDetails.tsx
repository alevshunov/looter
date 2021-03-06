import * as React from 'react';
import * as moment from 'moment';
import './WoEDetails.css';
import Container from '../components/Container';
import TableReport from '../components/TableReport';
import asNumber from '../components/asNumber';
import { Link } from 'react-router-dom';
import asDate from '../components/asDate';
import TextIcon from '../components/TextIcon';
import GA from '../extra/GA';
import ValueWithDelta from '../components/ValueWithDelta';
import ValueWithArrow from '../components/ValueWithArrow';

interface State {
    loading: boolean;
    data?: any;
    state24?: any;
}

interface Props {
    woeId: string;
}

class WoEDetails extends React.Component<Props, State> {

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
        fetch(`/rest/woe/info/${this.props.woeId}`)
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
        document.title = (this.state.data ? 'FreeRO - ' + this.state.data.woe.name : 'FreeRO - WoE');

        GA();

        if (!this.state.data) {
            return (
                <div className="area-woe-details"/>
            );
        }

        const parts: any[] = [];

        this.state.data.stat.forEach((attr: any) => {
            parts.push(<Container key={attr.id}>{this.renderAttr(attr)}</Container>);
        });

        return (
            <div className="area-woe-details">
                <Container>
                    <table className="table-report info">
                        <tbody>
                            <tr>
                                <td className="info-item table-report-cell">
                                    {this.state.data && this.state.data.woe.name}
                                </td>
                            </tr>
                            <tr>
                                <td className="info-item table-report-cell">
                                    {moment(this.state.data.woe.date)
                                        .locale('ru')
                                        .format('DD MMMM YYYY')}
                                </td>
                            </tr>
                            <tr>
                                <td className="info-item table-report-cell">
                                    <a href={`https://forum.free-ro.com/posts/${this.state.data.woe.postId}/`}>
                                        Источник
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <TableReport
                        userCls={'common'}
                        cells={
                            [
                                {
                                    title: '',
                                    field: 'name'
                                },
                                {
                                    title: '',
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
                        userCls={'castle-owners'}
                        title={'Владения замками'}
                        cells={
                            [
                                {
                                    title: '',
                                    field: 'owner',
                                    render: (v, d) =>
                                        <TextIcon
                                            linkUrl={`/woe/guild/${d.guildId}/${encodeURIComponent(d.guildName)}`}
                                            iconUrl={d.guildIconUrl}
                                        >
                                            <Link to={`/woe/guild/${d.guildId}/${encodeURIComponent(d.guildName)}`}>
                                                {d.guildName}
                                            </Link>
                                        </TextIcon>
                                },
                                {
                                    title: '',
                                    field: 'castle-icon',
                                    render: () => <i className="fab fa-fort-awesome"/>
                                },
                                {
                                    title: '',
                                    field: 'castle',
                                    render: (v, d) => (
                                        <div>
                                            <div className={'name'}>{d.castleName}</div>
                                            <div className={'location'}>{d.castleLocation}</div>
                                        </div>
                                    )
                                }
                            ]
                        }
                        data={this.state.data.castleOwnership}
                    />
                </Container>

                <Container>
                    <TableReport
                        userCls={'castle-o'}
                        title={'История захватов'}
                        cells={
                            [
                                {
                                    title: '',
                                    field: 'date',
                                    render: (v) => asDate(v, 'HH:mm:ss')
                                },
                                {
                                    title: '',
                                    field: 'owner',
                                    render: (v, d) =>
                                        <TextIcon
                                            linkUrl={`/woe/guild/${d.guildId}/${encodeURIComponent(d.guildName)}`}
                                            iconUrl={d.guildIconUrl}
                                        >
                                            <Link to={`/woe/player/${encodeURIComponent(d.playerName)}`}>
                                                {d.playerName}
                                            </Link>
                                        </TextIcon>
                                },
                                {
                                    title: '',
                                    field: 'castle-icon',
                                    render: () => <i className="fab fa-fort-awesome"/>
                                },
                                {
                                    title: '',
                                    field: 'castle',
                                    render: (v, d) => (
                                        <div>
                                            <div className={'name'}>{d.castleName}</div>
                                            <div className={'location'}>{d.castleLocation}</div>
                                        </div>
                                    )
                                }
                            ]
                        }
                        data={this.state.data.castlesLog}
                    />
                </Container>

                {parts}
            </div>
        );
    }

    renderAttr (attribute: any) {
        return (
            <TableReport
                userCls={'rate'}
                title={<span>{attribute.name} <i className={attribute.icon}/></span>}
                cells={
                    [
                        {
                            title: '',
                            field: 'position_index index',
                            render: (v, d) => { return d.position_index; }
                        },
                        {
                            title: '',
                            field: 'guildIcon',
                            render: (v, d) => v ?
                                <Link to={`/woe/guild/${d.guildId}/${encodeURIComponent(d.guildName)}`}>
                                    <img src={v} alt={d.playerName}/>
                                </Link> : ''
                        },
                        {
                            title: '',
                            field: 'playerName',
                            render: (name, d) =>
                                <div>
                                    <Link to={`/woe/player/${encodeURI(name)}`}>
                                        {name}
                                        <div className="rate">
                                            <div className="value">
                                                <ValueWithArrow
                                                    value={d.playerRate}
                                                    delta={d.playerRateDelta}
                                                    index={d.playerRateIndex}
                                                    indexDelta={d.playerRateIndexDelta}
                                                />
                                            </div>
                                            <div className="perk">
                                                <i className={d.playerSpec1Icon} title={d.playerSpec1Name}/>
                                                {' + '}
                                                <i className={d.playerSpec2Icon} title={d.playerSpec2Name}/>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                        },
                        {
                            title: '',
                            field: 'value',
                            align: 'right',
                            render: v => asNumber(v)
                        },
                        {
                            title: 'Среднее',
                            field: 'avg',
                            align: 'right',
                            render: (value, d) => (
                                <ValueWithDelta
                                    value={d.avgPlayerValueNew}
                                    delta={d.avgPlayerValueNew - d.avgPlayerValue}
                                />
                            )
                        },
                        {
                            title: 'Слава',
                            field: 'rate',
                            align: 'right',
                            render: (v, d) => (
                                <ValueWithDelta
                                    value={d.rate}
                                    index={d.rateIndex}
                                    // delta={d.isMain ? d.rateDelta : d.isAux ? d.rateDelta * 0.15 : 0}
                                    delta={d.rateDelta}
                                    userCls={d.isMain ? 'is-main' : d.isAux ? 'is-aux' : 'is-extra'}
                                />
                            )
                        },
                    ]
                }
                data={attribute.players}
            />
        );
    }
}

export default WoEDetails;
