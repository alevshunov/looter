import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Cards from './core/Cards';
import Shops from './core/Shops';
import AllItems from './core/AllItems';
import ShopItems from './core/ShopItems';
import ShopWithItem from './core/ShopsWithItem';
import Report from './core/Report';
import OwnerHistory from './core/OwnerHistory';

class App extends React.Component {

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route
                        exact={true}
                        path="/"
                        render={(props) => <Cards term=""/>}
                    />

                    <Route
                        exact={true}
                        path="/cards/"
                        render={(props) => <Cards term=""/>}
                    />

                    <Route
                        exact={true}
                        path="/cards/:term"
                        render={(props) => <Cards term={decodeURIComponent(props.match.params.term)}/>}
                    />

                    <Route
                        exact={true}
                        path="/shop/:shopId"
                        render={(props) => <ShopItems shopId={props.match.params.shopId}/>}
                    />

                    <Route
                        exact={true}
                        path="/shops"
                        render={(props) => <Shops term=""/>}
                    />

                    <Route
                        exact={true}
                        path="/shops/with/:name"
                        render={(props) => <ShopWithItem itemName={props.match.params.name}/>}
                    />

                    <Route
                        exact={true}
                        path="/shops/by/:owner"
                        render={(props) => <OwnerHistory owner={props.match.params.owner}/>}
                    />

                    <Route
                        exact={true}
                        path="/shops/:term"
                        render={(props) => <Shops term={decodeURIComponent(props.match.params.term)}/>}
                    />

                    <Route
                        exact={true}
                        path="/items"
                        render={(props) => <AllItems term=""/>}
                    />

                    <Route
                        exact={true}
                        path="/items/:term"
                        render={(props) => <AllItems term={decodeURIComponent(props.match.params.term)}/>}
                    />

                    <Route
                        exact={true}
                        path="/report"
                        render={(props) => <Report preview={false} />}
                    />

                    <Route
                        exact={true}
                        path="/report/preview"
                        render={(props) => <Report preview={true} />}
                    />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
