import * as React from 'react';
import BookIcon from '@material-ui/icons/Book';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import EqualizerIcon from '@material-ui/icons/Assessment';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import { NavLink } from 'react-router-dom';
import './MyNavigation.css';
import * as H from 'history';

class MyNavigation extends React.Component<{active: string}> {

    constructor(props: { active: string }, context: any) {
        super(props, context);
    }

    isActive(match: any, location: H.Location, url: string) {
        if (!match && url === '/shops/' && location.pathname.startsWith('/shop/')) {
            return true;
        }

        if (!match && url === '/report/' && location.pathname === '/') {
            return true;
        }

        return match;
    }

    render() {
        const items = [
            {
                icon: <BookIcon/>,
                title: 'Выпавшие карты',
                url: '/cards/'
            },
            {
                icon: <ShoppingCartIcon/>,
                title: 'Открытые магазины',
                url: '/shops/'
            },
            {
                icon: <LocalOfferIcon/>,
                title: 'Товары',
                url: '/items/'
            },
            {
                icon: <EqualizerIcon/>,
                title: 'Статистика',
                url: '/report/'
            },
            {
                icon: <AccountBalanceIcon/>,
                title: 'WoE',
                url: '/woe/'
            }
        ];

        return (
            <div className="nav-top">
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

export default MyNavigation;