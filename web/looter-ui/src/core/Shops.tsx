import * as React from 'react';
import { Link } from 'react-router-dom';
import RedirectableSearch from './components/RedirectableSearch';
import MyNavigation from './components/MyNavigation';

interface State {
    loading: boolean;
    data: Array<any>;
}

interface Props {
    term: string;
}

class Shops extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            data: [],
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
        fetch('https://free-ro.kudesnik.cc/rest/shops/all?term=' + encodeURIComponent(this.props.term))
            .then((response) => {
                try {
                    return response.json();
                } catch (e) {
                    return [];
                }
            })
            .then((data) => {
                me.setState({data, loading: false} );
            });

    }

    render() {
        document.title = this.props.term ? 'FreeRO - Shops - ' + this.props.term : 'FreeRO - Shops';

        return (
            <div className="limiter">
                <MyNavigation active="shops"/>
                <RedirectableSearch base="/shops/" term={this.props.term}/>
                <table className="table_center">
                    <thead>
                        <tr>
                            <th className="column1">Название</th>
                            <th className="column2">Игрок</th>
                            <th className="column3 right">Расположение</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.loading && <tr><td className="cell100 column1">Загрузка ...</td></tr>}
                        {
                            !this.state.loading && this.state.data.length === 0 &&
                            <tr>
                                <td className="column1" colSpan={3}>
                                    Открытых магазинов по поиску <strong>{this.props.term}</strong> не найдено.
                                </td>
                            </tr>
                        }
                        {
                            this.state.data.map((d, index) =>
                                (
                                    <tr key={index}>
                                        <td className="cell100 column1">
                                            {d.type === 'sell' ? 'S> ' : 'B> '}
                                            <Link to={'/shop/' + d.id}>{d.name}</Link>
                                        </td>
                                        <td className="cell100 column2">{d.owner}</td>
                                        <td className="cell100 column3 right">
                                            <Link to={'/shop/' + d.id}>{d.location}</Link>
                                        </td>
                                    </tr>
                                ))
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Shops;
