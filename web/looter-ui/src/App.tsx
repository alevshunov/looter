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
import WoEHistory from './core/woe/WoEHistory';
import WoEDetails from './core/woe/WoEDetails';
import WoEPlayers from './core/woe/WoEPlayers';
import WoEPlayer from './core/woe/WoEPlayer';
import WoEGuilds from './core/woe/WoEGuilds';
import WoEGuild from './core/woe/WoEGuild';
import WoECastles from './core/woe/WoECastles';
import WoELayout from './core/woe/WoELayout';

class App extends React.Component {

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route
                        exact={true}
                        path="/woe/"
                        render={(props) => <WoELayout><WoECastles /></WoELayout>}
                    />

                    <Route
                        exact={true}
                        path="/woe/history"
                        render={(props) => <WoELayout><WoEHistory /></WoELayout>}
                    />

                    <Route
                        exact={true}
                        path="/woe/castles"
                        render={(props) => <WoELayout><WoECastles /></WoELayout>}
                    />

                    <Route
                        exact={true}
                        path="/woe/players"
                        render={(props) => <WoELayout><WoEPlayers /></WoELayout>}
                    />

                    <Route
                        exact={true}
                        path="/woe/guilds"
                        render={(props) => <WoELayout><WoEGuilds /></WoELayout>}
                    />

                    <Route
                        exact={true}
                        path="/woe/guild/:id/:name"
                        render={(props) =>
                            <WoELayout>
                                <WoEGuild guildId={decodeURIComponent(props.match.params.id)} />
                            </WoELayout>
                        }
                    />

                    <Route
                        exact={true}
                        path="/woe/player/:playerName"
                        render={(props) =>
                            <WoELayout>
                                <WoEPlayer playerName={decodeURIComponent(props.match.params.playerName)} />
                            </WoELayout>
                        }
                    />

                    <Route
                        exact={true}
                        path="/woe/:woeId"
                        render={(props) =>
                            <WoELayout>
                                <WoEDetails woeId={decodeURIComponent(props.match.params.woeId)} />
                            </WoELayout>
                        }
                    />

                    <Route
                        exact={true}
                        path="/"
                        render={(props) => <Report preview={false} />}
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
