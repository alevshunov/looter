import * as React from 'react';
import * as moment from 'moment';
import './WoEDetails.css';
import GA from '../extra/GA';
import MyNavigation from '../components/MyNavigation';
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
        fetch(`http://localhost:9999/rest/woe/info/${this.props.woeId}`)
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
        document.title = (this.state.data ? 'FreeRO - WoE - ' + this.state.data.woe.name : 'FreeRO - WoE');

        GA();

        const parts: any[] = [];

        if (this.state.data) {
            this.state.data.stat.forEach((attr: any) => {
                parts.push(this.renderAttrHeader(attr));
                parts.push(this.renderAttr(attr));
            });
        }

        return (
            <div className="limiter area-woe-details">
                <MyNavigation active="woe"/>

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
                                    {this.state.data && moment(this.state.data.woe.date)
                                        .locale('ru')
                                        .format('DD MMMM YYYY')}
                                </td>
                            </tr>
                            <tr>
                                <td className="info-item table-report-cell">
                                    {
                                        this.state.data &&
                                        <a href={`https://forum.free-ro.com/posts/${this.state.data.woe.postId}/`}>
                                            Источник
                                        </a>
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Container>

                {parts}
            </div>
        );
    }

    renderAttr (attribute: any) {
        return (
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
                                    field: 'playerName',
                                    render: (v, d) =>
                                        <Link to={`/woe/player/${encodeURIComponent(d.playerName)}`}>
                                            {v}
                                        </Link>
                                },
                                {
                                    title: 'Значение',
                                    field: 'value',
                                    align: 'right',
                                    render: v => asNumber(v)
                                },
                                {
                                    title: 'Среднее',
                                    field: 'avgPlayerValueNew',
                                    align: 'right',
                                    render: (value, d) => asNumber(value)
                                },
                                {
                                    title: 'Дельта',
                                    align: 'right',
                                    field: 'delta',
                                    render: (value, d) => (
                                        <div>
                                            <span className="delta">
                                                {
                                                    d.avgPlayerValue < d.avgPlayerValueNew ?
                                                        <span className="up">
                                                            {' + '}{
                                                            asNumber(d.avgPlayerValueNew - d.avgPlayerValue,
                                                                undefined,
                                                                '0,0.00'
                                                            )}
                                                        </span>
                                                    :
                                                        <span className="down">
                                                            {' - '} {
                                                            asNumber(d.avgPlayerValue - d.avgPlayerValueNew,
                                                                undefined,
                                                                '0,0.00'
                                                            )}
                                                        </span>
                                                }
                                            </span>
                                        </div>
                                    )
                                }
                            ]
                        }
                        // title={attribute.name}
                        data={attribute.players}
                    />
                </Container>
        );
    }

    renderAttrHeader(attribute: any) {
        return (
            <Container>
                <table className="table-report info">
                    <tbody>
                        <tr>
                            <td className="info-item table-report-cell">
                                {attribute.name}
                            </td>
                        </tr>
                        <tr>
                            <td className="info-item table-report-cell">
                                В среднем по серверу: {asNumber(attribute.avg, undefined, '0,0.00')}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Container>
        );
    }
}

export default WoEDetails;
