import * as React from 'react';
import './ShopItems.css';
import * as moment from 'moment';
import { NavLink } from 'react-router-dom';

interface State {
    loading: boolean;

    data?: {
        items: Array<{
            name: string,
            count: number,
            price: number
        }>;
        name: string;
        location: string;
        owner: string;
        date: Date;
    };
}

interface Props {
    shopId: number;
}

class ShopItems extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {loading: true};
    }

    updateSearch() {
        this.setState({loading: true});

        const me = this;
        fetch('https://free-ro.kudesnik.cc/rest/shop/' + this.props.shopId)
            .then((response) => {
                try {
                    return response.json();
                } catch (e) {
                    return [];
                }
            })
            .then((data) => {
                me.setState({ data });
            });

    }

    componentWillMount() {
        this.updateSearch();
    }

    render() {
        let data  = this.state.data;

        if (!data) {  return null; }

        let renderPart = data.items.map((d, index) =>
            (
                <tr key={index}>
                    <td className="cell100 column1">
                        <NavLink to={'/shops/with/' + d.name}>{d.name}</NavLink>
                    </td>
                    <td className="cell100 column2">{d.count}</td>
                    <td className="cell100 column3 right">{d.price}</td>
                </tr>
            ));

        return (
            <div className="limiter">
                <div>
                    <table className="table_center info">
                        <tbody>
                            <tr>
                                <td className="info-item">{data.name}</td>
                            </tr>
                            <tr>
                                <td className="info-item">{data.owner}</td>
                            </tr>
                            <tr>
                                <td className="info-item">{data.location}</td>
                            </tr>
                            <tr>
                                <td className="info-item">{moment(data.date).format('DD-MM-YYYY, HH:mm')}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <table className="table_center">
                    <thead>
                        <tr>
                            <th className="column1">Name</th>
                            <th className="column2">Count</th>
                            <th className="column3 right">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderPart}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ShopItems;
