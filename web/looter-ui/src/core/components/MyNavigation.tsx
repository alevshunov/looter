import * as React from 'react';
import { NavLink } from 'react-router-dom';
import './MyNavigation.css';
import * as H from 'history';

class MyNavigation extends React.Component {

    constructor(props: any, context: any) {
        super(props, context);
    }

    isActive(match: any, location: H.Location, url: string) {
        if (!match && url === '/shops/' && location.pathname.startsWith('/shop/')) {
            return true;
        }

        if (!match && url === '/shops/' && location.pathname.startsWith('/items/')) {
            return true;
        }

        if (!match && url === '/shops/' && location.pathname.startsWith('/item/')) {
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
                icon: <i className="fas fa-clipboard"/>,
                title: 'Выпавшие карты',
                url: '/cards/'
            },
            {
                icon: <i className="fas fa-shopping-basket"/>,
                title: 'Торговля',
                url: '/shops/'
            },
            // {
            //     icon: <i className="fab fa-fort-awesome"/>,
            //     title: 'WoE',
            //     url: '/woe/'
            // },
            {
                icon: <i className="fas fa-info"/>,
                title: 'Статистика',
                url: '/report/'
            }
        ];

        return (
            <div className="nav-top main-navigation">
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