import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Cards from './core/Cards';
import Shops from './core/Shops';
import AllItems from './core/AllItems';
import ShopItems from './core/ShopItems';

class App extends React.Component {

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact={true} path="/" component={Cards}/>
                    <Route exact={true} path="/shops" component={Shops}/>
                    <Route
                        exact={true}
                        path="/shop/:shopId"
                        render={(props) => <ShopItems shopId={props.match.params.shopId}/>}
                    />
                    <Route exact={true} path="/shops/items" component={AllItems}/>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
