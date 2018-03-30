import * as React from 'react';
import asPrice from './components/asPrice';
import MyNavigation from './components/MyNavigation';
import Container from './components/Container';
import GA from './extra/GA';
import Calendar from './components/Calendar';
import * as moment from 'moment';
import './ItemHistory.css';

interface State {
    loading: boolean;
    price?: Array<{date: Date, minSell: number, maxSell: number, minBuy: number, maxBuy: number}>;
}

interface Props {
    itemName: string;
}

class ItemHistory extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            loading: false
        };
    }

    componentWillMount() {
        this.doLoad();
    }

    componentWillReceiveProps(props: Props) {
        setTimeout(this.doLoad.bind(this), 1);
    }

    doLoad() {
        this.setState({loading: true});

        const me = this;

        fetch('https://free-ro.kudesnik.cc/rest/item/price/' + encodeURIComponent(this.props.itemName))
            .then((response) => {
                try {
                    return response.json();
                } catch (e) {
                    return [];
                }
            })
            .then((price) => {
                me.setState({price} );
            });

    }

    render() {
        document.title = this.props.itemName ? 'FreeRO - Item History - ' + this.props.itemName : 'FreeRO - Shops';
        GA();

        return (
            <div className="limiter">
                <MyNavigation active="shops"/>
                <Container>
                    <table className="table-report info">
                        <tbody>
                        <tr>
                            <td className="info-item table-report-cell shop-item-name">{this.props.itemName}</td>
                        </tr>
                        </tbody>
                    </table>
                </Container>

                <Container>
                    <Calendar
                        start={moment().add({day: -31}).toDate()}
                        end={moment().toDate()}
                        render={(date) => {
                            if (!this.state.price) {
                                return <div/>;
                            }

                            const item = this.state.price.find((x) => {
                                return moment(x.date).dayOfYear() === date.dayOfYear();
                            });

                            if (!item) {
                                return <div/>;
                            }

                            return (
                                <div className={'price'}>
                                    <div className={'title'}>Продажа:</div>
                                    <div className={'sell item'}>{asPrice(item.minSell, item.maxSell, '0,')}</div>
                                    <div className={'title'}>Скупка:</div>
                                    <div className={'buy item'}>{asPrice(item.minBuy, item.maxBuy)}</div>
                                </div>
                            );
                        }}
                    />
                </Container>
            </div>
        );
    }
}

export default ItemHistory;
