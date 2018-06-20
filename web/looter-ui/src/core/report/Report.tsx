import * as React from 'react';
import MyNavigation from '../components/MyNavigation';
import Report24 from '../components/Report24';
import TableReport from '../components/TableReport';
import Container from '../components/Container';
import asPrice from '../components/asPrice';
import asNumber from '../components/asNumber';
import { NavLink } from 'react-router-dom';
import * as moment from 'moment';
import { ReportEntry } from 'my-models/Report';
import './Report.css';
import 'moment/locale/ru';
import ContainerText from '../components/ContainerText';
import GA from '../extra/GA';
import TimeCachedStore from '../extra/TimeCachedStore';

class Report extends React.Component<{preview: boolean}, { loading: boolean, report?: ReportEntry}> {
    constructor(props: {preview: boolean}, context: any) {
        super(props, context);

        this.state = { loading: false };
    }

    componentWillMount() {
        this.setState({loading: true});
        const me = this;

        const cacheData = TimeCachedStore.instance().get(`/report`);
        if (cacheData) {
            me.setState({ report: cacheData, loading: false });
            return;
        }

        fetch('/rest/report' + (this.props.preview ? '/preview' : ''))
            .then((response) => {
                try {
                    return response.json();
                } catch (e) {
                    return [];
                }
            })
            .then((report) => {
                TimeCachedStore.instance().set(`/report`, report, moment().add({day: 1}).toDate());
                me.setState({ report, loading: false });
            });
    }

    render() {
        document.title = 'FreeRO - Weekly report';
        GA();

        if (!this.state.report) {
            return (
                <div className="limiter">
                    <MyNavigation/>
                    <Container>
                        <ContainerText>Загрузка...</ContainerText>
                    </Container>
                </div>
            );
        }

        const price = (x: any) => asPrice(x);
        const digits = (x: any) => asNumber(x);
        const report = this.state.report;

        return (
            <div className="limiter">
                <MyNavigation/>

                <Container>
                    <ContainerText>
                        <div style={{textAlign: 'center'}}>
                            Статистика за неделю:<br/><br/>
                            <strong>
                                {moment(report.reportInfo.start)
                                    .locale('ru')
                                    .format('DD MMMM YYYY, HH:mm')} - {' '}
                                {moment(report.reportInfo.end)
                                    .locale('ru')
                                    .add({ second: -1 })
                                    .format('DD MMMM YYYY, HH:mm')}
                            </strong>
                        </div>
                    </ContainerText>
                </Container>

                {report.levelUppedOfAWeek &&
                <Container>
                    <ContainerText>
                        Сияйкой недели признан игрок
                        {' '}<NavLink to={'/cards/' + report.levelUppedOfAWeek.owner}>
                        {report.levelUppedOfAWeek.owner}
                    </NavLink> взявший лампу
                        {' '}{moment(report.levelUppedOfAWeek.date)
                            .locale('ru')
                            .format('DD MMMM YYYY в HH:mm')}
                    .
                    </ContainerText>
                </Container>
                }

                {report.chatStoreOfAWeek &&
                <Container>
                    <ContainerText>
                        Фраза недели, произнесенная игроком <strong>{report.chatStoreOfAWeek.owner}</strong>:
                        <blockquote><p>{report.chatStoreOfAWeek.message}</p></blockquote>
                    </ContainerText>
                </Container>
                }

                {report.cardOfAWeek &&
                <Container>
                    <ContainerText>
                    Картой недели выбрана <NavLink to={'/cards/' + report.cardOfAWeek}>{report.cardOfAWeek}</NavLink>.
                    </ContainerText>
                </Container>
                }

                {report.shopLotOfAWeek &&
                <Container>
                    <ContainerText>
                        Товаром недели выбран
                        {' '}<NavLink to={'/items/' + report.shopLotOfAWeek.name}>{report.shopLotOfAWeek.name}</NavLink>
                        .
                    </ContainerText>
                </Container>
                }

                {report.shopOfAWeek &&
                <Container>
                    <ContainerText>
                        Магазином недели признан
                        {' '}"<strong>{report.shopOfAWeek.name}</strong>"
                        {' '}в <NavLink to={'/shop/' + report.shopOfAWeek.id}>{report.shopOfAWeek.location}</NavLink>.
                    </ContainerText>
                </Container>
                }

                {report.levelUpped &&
                <Container>
                    <ContainerText>
                        Взяли лампу:
                    </ContainerText>
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
                                    title: 'Время',
                                    field: 'date',
                                    align: 'right',
                                    render: (date) => moment(date)
                                        .locale('ru')
                                        .format('DD MMMM YYYY, HH:mm')
                                }
                            ]
                        }
                        data={report.levelUpped}
                    />
                </Container>
                }

                <Container>
                    <ContainerText>
                    <Report24 data={this.state.report.cardDropActivity} title="Распределение выбивания карт по часам"/>
                    </ContainerText>
                </Container>

                <Container>
                    <ContainerText>
                        Выбиватели карт:
                    </ContainerText>
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
                    <ContainerText>
                        Популярность карт:
                    </ContainerText>
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
                    <ContainerText>
                        Карточные задроты:
                    </ContainerText>
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
                    <ContainerText>
                        <Report24
                            data={this.state.report.chatActivity}
                            title="Распределение сказанных фраз в #main по часам"
                        />
                    </ContainerText>
                </Container>

                <Container>
                    <ContainerText>
                        Наиболее говорящие в #main:
                    </ContainerText>
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
                    <ContainerText>
                        Наиболее подробные сообщения оставляли:
                    </ContainerText>
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

                {this.state.report.shopActivity &&
                <Container>
                    <ContainerText>
                    <Report24
                        data={this.state.report.shopActivity}
                        title="Распределение открытия магазинов и скупок по часам"
                    />
                    </ContainerText>
                </Container>}

                <Container>
                    <ContainerText>
                        Брендовые магазины:
                    </ContainerText>
                    <TableReport
                        cells={
                            [
                                {title: '', field: 'index', align: 'center'},
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
                    <ContainerText>
                        Самые дорогие вещи:
                    </ContainerText>
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
                    <ContainerText>
                        Магазины для народа:
                    </ContainerText>
                    <TableReport
                        cells={
                            [
                                {title: '', field: 'index', align: 'center'},
                                {title: 'Название', field: 'name'},
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
                    <ContainerText>
                        Чрезмерно активные торговцы:
                    </ContainerText>
                    <TableReport
                        cells={
                            [
                                {title: '', field: 'index', align: 'center'},
                                {
                                    title: 'Игрок',
                                    field: 'owner',
                                    render: (name) => <NavLink to={'/shops/by/' + name}>{name}</NavLink>
                                },
                                {title: 'Открывал магазин', field: 'count', align: 'right'}
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