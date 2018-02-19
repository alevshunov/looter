import * as React from 'react';

interface State {
    data: Array<{
        name: string,
        count: number,
        min: number,
        max: number
    }>;
}

interface Props {

}

class Shops extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        let data: Array<{
            name: string,
            count: number,
            min: number,
            max: number
        }> = [];

        this.state = { data };
    }

    componentWillMount() {
        const me = this;
        fetch('https://free-ro.kudesnik.cc/rest/shops/active')
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

    render() {
        let data  = this.state.data;
        let renderPart = data.map((d, index) =>
            (
                <tr key={index}>
                    <td className="cell100 column1">
                        <a href={'http://rodb.kudesnik.cc/item/?term=' + d.name}>{d.name}</a>
                    </td>
                    <td className="cell100 column2">{d.count}</td>
                    <td className="cell100 column3">{d.min} - {d.max}</td>
                </tr>
            ));

        return (
            <div className="limiter">
                <table className="table_center">
                    <thead>
                        <tr>
                            <th className="column1">Name</th>
                            <th className="column2">Count</th>
                            <th className="column3">Price</th>
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

export default Shops;
