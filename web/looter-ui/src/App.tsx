import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Cards from './core/cards/Cards';
import Shops from './core/shops/Shops';
import AllItems from './core/shops/AllItems';
import ShopItems from './core/shops/ShopItems';
import ShopWithItem from './core/shops/ShopsWithItem';
import Report from './core/report/Report';
import OwnerHistory from './core/shops/OwnerHistory';
import WoEHistory from './core/woe/WoEHistory';
import WoEDetails from './core/woe/WoEDetails';
import WoEPlayers from './core/woe/WoEPlayers';
import WoEPlayer from './core/woe/WoEPlayer';
import WoEGuilds from './core/woe/WoEGuilds';
import WoEGuild from './core/woe/WoEGuild';
import WoECastles from './core/woe/WoECastles';
import WoELayout from './core/woe/WoELayout';
import Deals from './core/shops/deals/Deals';
import ItemDeals from './core/shops/deals/ItemDeals';
import ShopsLayout from './core/shops/ShopsLayout';

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
                        render={(props) => <WoELayout><WoEPlayers term=""/></WoELayout>}
                    />

                    <Route
                        exact={true}
                        path="/woe/players/:term"
                        render={(props) =>
                            <WoELayout>
                                <WoEPlayers term={decodeURIComponent(props.match.params.term)}/>
                            </WoELayout>
                        }
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
                        path="/shops/deals/:term"
                        render={(props) =>
                            <ShopsLayout>
                                <Deals term={decodeURIComponent(props.match.params.term)}/>
                            </ShopsLayout>
                        }
                    />

                    <Route
                        exact={true}
                        path="/shops/deals"
                        render={(props) => <ShopsLayout><Deals term={''} /></ShopsLayout>}
                    />

                    <Route
                        exact={true}
                        path="/shop/:shopId"
                        render={(props) => <ShopsLayout><ShopItems shopId={props.match.params.shopId}/></ShopsLayout>}
                    />

                    <Route
                        exact={true}
                        path="/shops"
                        render={(props) => <ShopsLayout><Shops term=""/></ShopsLayout>}
                    />

                    <Route
                        exact={true}
                        path="/shops/with/:name"
                        render={(props) =>
                            <ShopsLayout>
                                <ShopWithItem itemName={props.match.params.name}/>
                            </ShopsLayout>
                        }
                    />

                    <Route
                        exact={true}
                        path="/shops/by/:owner"
                        render={(props) => <ShopsLayout><OwnerHistory owner={props.match.params.owner}/></ShopsLayout>}
                    />

                    <Route
                        exact={true}
                        path="/shops/:term"
                        render={(props) =>
                            <ShopsLayout>
                                <Shops term={decodeURIComponent(props.match.params.term)}/>
                            </ShopsLayout>
                        }
                    />

                    <Route
                        exact={true}
                        path="/items/by/:order/:direction/:term"
                        render={(props) =>
                            <ShopsLayout>
                            <AllItems
                                term={decodeURIComponent(props.match.params.term)}
                                order={{ field: props.match.params.order, direction: props.match.params.direction }}
                            />
                            </ShopsLayout>
                        }
                    />

                    <Route
                        exact={true}
                        path="/items/by/:order/:direction"
                        render={(props) =>
                            <ShopsLayout>
                            <AllItems
                                term=""
                                order={{ field: props.match.params.order, direction: props.match.params.direction }}
                            />
                            </ShopsLayout>
                        }
                    />

                    <Route
                        exact={true}
                        path="/items/:term"
                        render={(props) =>
                            <ShopsLayout>
                                <AllItems
                                    term={decodeURIComponent(props.match.params.term)}
                                    order={{ field: 'default', direction: 'asc' }}
                                />
                            </ShopsLayout>
                        }
                    />

                    <Route
                        exact={true}
                        path="/items"
                        render={(props) =>
                            <ShopsLayout>
                                <AllItems
                                    term=""
                                    order={{ field: 'default', direction: 'asc' }}
                                />
                            </ShopsLayout>
                        }
                    />

                    <Route
                        exact={true}
                        path="/item/:itemName/deals/sold"
                        render={(props) =>
                            <ShopsLayout>
                                <ItemDeals
                                    itemName={decodeURIComponent(props.match.params.itemName)}
                                    area={'sold'}
                                />
                            </ShopsLayout>
                        }
                    />

                    <Route
                        exact={true}
                        path="/item/:itemName/deals/bought"
                        render={(props) =>
                            <ShopsLayout>
                                <ItemDeals
                                    itemName={decodeURIComponent(props.match.params.itemName)}
                                    area={'bought'}
                                />
                            </ShopsLayout>
                        }
                    />

                    <Route
                        exact={true}
                        path="/item/:itemName/deals/sold/price"
                        render={(props) =>
                            <ShopsLayout>
                                <ItemDeals
                                    itemName={decodeURIComponent(props.match.params.itemName)}
                                    area={'sold-price'}
                                />
                            </ShopsLayout>
                        }
                    />

                    <Route
                        exact={true}
                        path="/item/:itemName/deals/bought/price"
                        render={(props) =>
                            <ShopsLayout>
                                <ItemDeals
                                    itemName={decodeURIComponent(props.match.params.itemName)}
                                    area={'bought-price'}
                                />
                            </ShopsLayout>
                        }
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
