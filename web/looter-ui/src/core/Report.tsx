import * as React from 'react';
import MyNavigation from './components/MyNavigation';
import Report24 from './components/Report24';
import TableReport from './components/TableReport';
// import * as moment from 'moment';

class ReportEntry {
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

    shopOfAWeek: { owner: string; name: string; location: string; };
    shopLotOfAWeek: { name: string; owner: string; shopName: string; location: string; };
    shopMostExpensive: Array<{ owner: string; name: string; totalPrice: number; location: string; }>;
    shopMostCheapest: Array<{ owner: string; totalPrice: number; location: string; }>;
    shopMostUnstable: Array<{ owner: string; count: number; }>;
    // shopMostSellableItems: Array<{name: string; count: number; totalValue: number}>;
    shopMostExpensiveLots: Array<{ name: string; price: number; shopName: string; shopOwner: string; }>;
}

class Report extends React.Component<{}, { loading: boolean, report?: ReportEntry}> {
    constructor(props: {}, context: any) {
        super(props, context);

        this.state = { loading: false, report: undefined};
    }

    componentWillMount() {
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
                me.setState({ report, loading: false });
            });
    }

    render() {
        document.title = 'FreeRO - Weekly report';

        if (!this.state.report) {
            return null;
        }

        const report = this.state.report;

        return (
            <div className="limiter">
                <MyNavigation active="cards"/>

                <div className="input-container">
                    <Report24 data={this.state.report.cardDropActivity} /><br/>
                    Card of the week: {report.cardOfAWeek}<br/>
                    Top players:
                    <TableReport
                        cells={
                            [
                                {title: 'Player', field: 'owner'},
                                {title: 'Count', field: 'count'}
                            ]
                        }
                        data={report.cardTopPlayer}
                    />

                    Top cards:
                    <TableReport
                        cells={
                            [
                                {title: 'Card', field: 'card'},
                                {title: 'Count', field: 'count'}
                            ]
                        }
                        data={report.cardTopDrop}
                    />

                    Lovely cards:
                    <TableReport
                        cells={
                            [
                                {title: 'Player', field: 'owner'},
                                {title: 'Card', field: 'card'},
                                {title: 'Count', field: 'count'}
                            ]
                        }
                        data={report.cardLovelyPlaces}
                    />
                </div>

                <div className="input-container">
                    <Report24 data={this.state.report.chatActivity} />
                    Story of the week: {report.chatStoreOfAWeek.message} by {report.chatStoreOfAWeek.owner}<br/>
                    Top speakers:
                    <TableReport
                        cells={
                            [
                                {title: 'Player', field: 'owner'},
                                {title: 'Count', field: 'count'},
                                {title: 'Random message', field: 'randomMessage'}
                            ]
                        }
                        data={report.chatTopSpeakers}
                    />

                    Top story tellers:
                    <TableReport
                        cells={
                            [
                                {title: 'Player', field: 'owner'},
                                {title: 'Average length', field: 'averageLength'},
                                {title: 'Random message', field: 'randomMessage'}
                            ]
                        }
                        data={report.chatStoryTellers}
                    />

                </div>
                <div className="input-container">
                    Shop of the week: {report.shopOfAWeek.name} by {report.shopOfAWeek.owner} at
                    {' '}{report.shopOfAWeek.location}<br/>

                    Lot of the week: {report.shopLotOfAWeek.name} available in {report.shopLotOfAWeek.shopName} by
                    {' '}{report.shopLotOfAWeek.owner} at {report.shopLotOfAWeek.location}<br/>

                    Most expensive shops:
                    <TableReport
                        cells={
                            [
                                {title: 'Player', field: 'owner'},
                                {title: 'Name', field: 'name'},
                                {title: 'Total price', field: 'totalPrice'},
                                {title: 'Location', field: 'location'}
                            ]
                        }
                        data={report.shopMostExpensive}
                    />

                    Most expensive lots:
                    <TableReport
                        cells={
                            [
                                {title: 'Name', field: 'name'},
                                {title: 'Price', field: 'price'}
                            ]
                        }
                        data={report.shopMostExpensiveLots}
                    />

                    Most cheapest shops:
                    <TableReport
                        cells={
                            [
                                {title: 'Player', field: 'owner'},
                                {title: 'Name', field: 'name'},
                                {title: 'Total price', field: 'totalPrice'},
                                {title: 'Location', field: 'location'}
                            ]
                        }
                        data={report.shopMostCheapest}
                    />

                    Most undetermined shops:
                    <TableReport
                        cells={
                            [
                                {title: 'Player', field: 'owner'},
                                {title: 'Changed', field: 'count'}
                            ]
                        }
                        data={report.shopMostUnstable}
                    />
                </div>
            </div>
        );
    }
}

export default Report;