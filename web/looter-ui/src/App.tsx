import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Cards from './core/Cards';
import Shops from './core/Shops';

class App extends React.Component {

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact={true} path="/" component={Cards}/>
                    <Route exact={true} path="/shops" component={Shops}/>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
