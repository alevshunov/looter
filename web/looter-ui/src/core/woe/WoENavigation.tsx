import * as React from 'react';
// import BookIcon from '@material-ui/icons/Book';
// import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
// import LocalOfferIcon from '@material-ui/icons/LocalOffer';
// import EqualizerIcon from '@material-ui/icons/Assessment';
// import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import People from '@material-ui/icons/People';
// import Person from '@material-ui/icons/Person';
import Public from '@material-ui/icons/Public';
import LocationCity from '@material-ui/icons/LocationCity';
import { NavLink } from 'react-router-dom';
import './WoENavigation.css';
import * as H from 'history';

class WoENavigation extends React.Component<{active: string}> {

    constructor(props: { active: string }, context: any) {
        super(props, context);
    }

    isActive(match: any, location: H.Location, url: string) {
        return (location.pathname === url || location.pathname + '/' === url);
    }

    render() {
        const items = [
            {
                icon: <Public/>,
                title: 'История ГВ',
                url: '/woe/'
            },
            {
                icon: <LocationCity/>,
                title: 'Гильдии',
                url: '/woe/guilds/'
            },
            {
                icon: <People/>,
                title: 'Активные игроки',
                url: '/woe/players/'
            }
        ];

        return (
            <div className="nav-top sub">
                {items.map(a => (
                    <NavLink
                        className={'nav-link'}
                        to={a.url}
                        key={a.url}
                        isActive={(match, location) => this.isActive(match, location, a.url)}
                    >
                        <div className={'nav-item'} >
                            <div className={'nav-icon'}>
                                {a.icon}
                            </div>
                            <div className={'nav-title'}>
                                {a.title}
                            </div>
                        </div>
                    </NavLink>
                ))}
            </div>
        );
    }
}

export default WoENavigation;