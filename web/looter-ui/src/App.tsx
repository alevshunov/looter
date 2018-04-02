import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Cards from './core/Cards';
import Shops from './core/Shops';
import AllItems from './core/AllItems';
import ShopItems from './core/ShopItems';
import ShopWithItem from './core/ShopsWithItem';
import Report from './core/Report';
import OwnerHistory from './core/OwnerHistory';
import ItemHistory from './core/ItemHistory';

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
                        path="/items/by/:order/:direction/:term"
                        render={(props) =>
                            <AllItems
                                term={decodeURIComponent(props.match.params.term)}
                                order={{ field: props.match.params.order, direction: props.match.params.direction }}
                            />
                        }
                    />

                    <Route
                        exact={true}
                        path="/items/by/:order/:direction"
                        render={(props) =>
                            <AllItems
                                term=""
                                order={{ field: props.match.params.order, direction: props.match.params.direction }}
                            />}
                    />

                    <Route
                        exact={true}
                        path="/items/:term"
                        render={(props) =>
                            <AllItems
                                term={decodeURIComponent(props.match.params.term)}
                                order={{ field: 'default', direction: 'asc' }}
                            />
                        }
                    />

                    <Route
                        exact={true}
                        path="/items"
                        render={(props) =>
                            <AllItems
                                term=""
                                order={{ field: 'default', direction: 'asc' }}
                            />}
                    />

                    <Route
                        exact={true}
                        path="/item/history/:itemName"
                        render={(props) => <ItemHistory itemName={decodeURIComponent(props.match.params.itemName)}/>}
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

                    <Route
                        exact={true}
                        path="*"
                        render={(props) => <Report preview={false} />}
                    />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
