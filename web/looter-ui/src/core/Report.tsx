import * as React from 'react';
import MyNavigation from './components/MyNavigation';
import Report24 from './components/Report24';
import TableReport from './components/TableReport';
import Container from './components/Container';
import asPrice from './components/asPrice';
import asNumber from './components/asNumber';
import { NavLink } from 'react-router-dom';
import * as moment from 'moment';
import './Report.css';

class ReportEntry {
    reportInfo: { start: Date; end: Date; date: Date; };
    cardOfAWeek: string;
    cardDropActivity: Array<number>;
    cardTopPlayer: Array<{ owner: string; count: number }>;
    cardTopDrop: Array<{ card: string; count: number }>;
    cardLovelyPlaces: Array<{card: string; owner: string; count: number }>;

    chatStoreOfAWeek: { owner: string; message: string; date: Date; };
    chatActivity: Array<number>;
    chatTopSpeakers: Array<{ owner: string; count: number; randomMessage: string; }>;
    chatStoryTellers: Array<{ owner: string; averageLength: number; randomMessage: string; }>;
    // chatMostSmilest: Array<{owner: string; count: number; randomMessage: string;}>;

    shopOfAWeek: { id: number; owner: string; name: string; location: string; };
    shopLotOfAWeek: { id: number; name: string; owner: string; shopName: string; location: string; };
    shopMostExpensive: Array<{ owner: string; name: string; totalPrice: number; location: string; }>;
    shopMostCheapest: Array<{ owner: string; totalPrice: number; location: string; }>;
    shopMostUnstable: Array<{ owner: string; count: number; }>;
    // shopMostSellableItems: Array<{name: string; count: number; totalValue: number}>;
    shopMostExpensiveLots: Array<{ name: string; price: number; shopName: string; shopOwner: string; }>;
}

class Report extends React.Component<{}, { loading: boolean, report?: ReportEntry}> {
    constructor(props: {}, context: any) {
        super(props, context);

        this.state = { loading: false, report: window['__report']};
    }

    componentWillMount() {
        if (this.state.report) {
            return;
        }

        this.setState({loading: true, report: undefined});

        const me = this;
        fetch('https://free-ro.kudesnik.cc/rest/report')
            .then((response) => {
                try {
                    return response.json();
                } catch (e) {
                    return [];
                }
            })
            .then((report) => {
                window['__report'] = report;
                me.setState({ report, loading: false });
            });
    }

    render() {
        const price = (x: any) => asPrice(x);
        const digits = (x: any) => asNumber(x);

        document.title = 'FreeRO - Weekly report';

        if (!this.state.report) {
            return null;
        }

        const report = this.state.report;

        return (
            <div className="limiter">
                <MyNavigation active="report"/>

                <Container>
                    <div style={{textAlign: 'center'}}>
                        <i>
                            {moment(report.reportInfo.start).format('DD-MM-YYYY, HH:mm')} - {' '}
                            {moment(report.reportInfo.end).format('DD-MM-YYYY, HH:mm')}
                        </i>
                    </div>
                </Container>

                {report.cardOfAWeek &&
                <Container>
                    Картой недели выбрана <NavLink to={'/cards/' + report.cardOfAWeek}>{report.cardOfAWeek}</NavLink>.
                </Container>
                }

                {report.chatStoreOfAWeek &&
                <Container>
                    Фраза недели, произнесенная игроком <strong>{report.chatStoreOfAWeek.owner}</strong>:
                    <blockquote><p>{report.chatStoreOfAWeek.message}</p></blockquote>
                </Container>
                }

                {report.shopOfAWeek &&
                <Container>
                    Магазином недели признан
                    {' '}<strong>{report.shopOfAWeek.name}</strong>,
                    {' '}выставленный
                    {' '}<NavLink to={'/shops/' + report.shopOfAWeek.owner}>{report.shopOfAWeek.owner}</NavLink> в
                    {' '}<NavLink to={'/shop/' + report.shopOfAWeek.id}>{report.shopOfAWeek.location}</NavLink>.
                </Container>
                }

                {report.shopLotOfAWeek &&
                <Container>
                    Товаром недели выбран
                    {' '}<NavLink to={'/items/' + report.shopLotOfAWeek.name}>{report.shopLotOfAWeek.name}</NavLink>,
                    {' '}был доступен в магазине
                    {' '}<strong>{report.shopLotOfAWeek.shopName}</strong>,
                    {' '}владельца
                    {' '}<NavLink to={'/shops/' + report.shopLotOfAWeek.owner}>{report.shopLotOfAWeek.owner}</NavLink>
                    {' '}в
                    {' '}<NavLink to={'/shop/' + report.shopLotOfAWeek.id}>{report.shopLotOfAWeek.location}</NavLink>.
                </Container>
                }

                <Container>
                    <Report24 data={this.state.report.cardDropActivity} title="Распределение выбивания карт по часам"/>
                </Container>

                <Container>
                    Выбиватели карт:
                    <TableReport
                        cells={
                            [
                                {title: '', field: 'index', align: 'center'},
                                {
                                    title: 'Игрок',
                                    field: 'owner',
                                    render: (name) => <NavLink to={'/cards/' + name}>{name}</NavLink>
                                },
                                {title: 'Выбил карт', field: 'count', align: 'right'}
                            ]
                        }
                        data={report.cardTopPlayer}
                    />
                </Container>

                <Container>
                    Популярность карт:
                    <TableReport
                        cells={
                            [
                                {title: '', field: 'index', align: 'center'},
                                {
                                    title: 'Карта',
                                    field: 'card',
                                    render: (name) => <NavLink to={'/cards/' + name}>{name}</NavLink>
                                },
                                {title: 'Выбита раз', field: 'count', align: 'right'}
                            ]
                        }
                        data={report.cardTopDrop}
                    />
                </Container>

                <Container>
                    Карточные задроты:
                    <TableReport
                        cells={
                            [
                                {title: '', field: 'index', align: 'center'},
                                {
                                    title: 'Игрок',
                                    field: 'owner',
                                    render: (name) => <NavLink to={'/cards/' + name}>{name}</NavLink>
                                },
                                {
                                    title: 'Карта',
                                    field: 'card',
                                    render: (name) => <NavLink to={'/cards/' + name}>{name}</NavLink>
                                },
                                {title: 'Выбил раз', field: 'count', align: 'right'}
                            ]
                        }
                        data={report.cardLovelyPlaces}
                    />
                </Container>

                <Container>
                    <Report24
                        data={this.state.report.chatActivity}
                        title="Распределение сказанных фраз в #main по часам"
                    />
                </Container>

                <Container>
                    Наиболее говорящие в #main:
                    <TableReport
                        cells={
                            [
                                {title: '', field: 'index', align: 'center'},
                                {title: 'Игрок', field: 'owner'},
                                {title: 'Сообщений', field: 'count', align: 'right', render: digits},
                                {title: 'Случайная фраза', field: 'randomMessage'}
                            ]
                        }
                        data={report.chatTopSpeakers}
                    />
                </Container>

                <Container>
                    Наиболее подробные сообщения оставляли:
                    <TableReport
                        cells={
                            [
                                {title: '', field: 'index', align: 'center'},
                                {title: 'Игрок', field: 'owner'},
                                // {title: 'Символов', field: 'averageLength', align: 'right'},
                                {title: 'Случайная фраза', field: 'randomMessage'}
                            ]
                        }
                        data={report.chatStoryTellers}
                    />
                </Container>

                <Container>
                    Наиболее брендовые магазины:
                    <TableReport
                        cells={
                            [
                                {title: '', field: 'index', align: 'center'},
                                {
                                    title: 'Игрок',
                                    field: 'owner',
                                    render: (name) => <NavLink to={'/shops/' + name}>{name}</NavLink>
                                },
                                {
                                    title: 'Имя',
                                    field: 'name'
                                },
                                {
                                    title: 'Сумммарная стоимость', field: 'totalPrice', align: 'right', render: price
                                },
                                {
                                    title: 'Расположение',
                                    field: 'location',
                                    align: 'right',
                                    render: (name, s) => <NavLink to={'/shop/' + s.id}>{name}</NavLink>
                                }
                            ]
                        }
                        data={report.shopMostExpensive}
                    />
                </Container>

                <Container>
                    Наиболее дорогие вещи:
                    <TableReport
                        cells={
                            [
                                {title: '', field: 'index', align: 'center'},
                                {
                                    title: 'Название',
                                    field: 'name',
                                    render: (name) => <NavLink to={'/items/' + name}>{name}</NavLink>
                                },
                                {title: 'Цена', field: 'price', align: 'right', render: price}
                            ]
                        }
                        data={report.shopMostExpensiveLots}
                    />
                </Container>

                <Container>
                    Магазины для народа:
                    <TableReport
                        cells={
                            [
                                {title: '', field: 'index', align: 'center'},
                                {title: 'Название', field: 'name'},
                                {
                                    title: 'Игрок',
                                    field: 'owner',
                                    render: (name) => <NavLink to={'/shop/' + name}>{name}</NavLink>
                                },
                                {
                                    title: 'Суммарная стоимость',
                                    field: 'totalPrice',
                                    align: 'right',
                                    render: price
                                },
                                {
                                    title: 'Расположение',
                                    field: 'location',
                                    align: 'right',
                                    render: (name, s) => <NavLink to={'/shop/' + s.id}>{name}</NavLink>
                                }
                            ]
                        }
                        data={report.shopMostCheapest}
                    />
                </Container>

                <Container>
                    Наиболее активные торговцы:
                    <TableReport
                        cells={
                            [
                                {title: '', field: 'index', align: 'center'},
                                {title: 'Игрок', field: 'owner'},
                                {title: 'Открывал магазина', field: 'count', align: 'right'}
                            ]
                        }
                        data={report.shopMostUnstable}
                    />
                </Container>
            </div>
        );
    }
}

export default Report;