import * as React from 'react';
import { NavLink } from 'react-router-dom';
import * as H from 'history';
import './ShopsNavigation.css';

class ShopsNavigation extends React.Component {

    constructor(props: any, context: any) {
        super(props, context);
    }

    isActive(match: any, location: H.Location, url: string) {
        if (!match && url === '/shops/deals' && /^\/item\/.+?\/deals\/.+/.test(location.pathname)) {
            return true;
        }

        if (!match && url === '/items/' && /^\/shops\/with\/.+/.test(location.pathname)) {
            return true;
        }

        if (!match && url === '/shops/' && /^\/shop\/.+/.test(location.pathname)) {
            return true;
        }

        return (location.pathname === url || location.pathname + '/' === url);
    }

    render() {
        const items = [
            {
                icon: <i className="fas fa-shopping-cart"/>,
                title: 'Активные магазины',
                url: `/shops/`
            },
            {
                icon: <i className="fas fa-boxes"/>,
                title: 'Доступные товары',
                url: `/items/`
            },
            {
                icon: <i className="fas fa-handshake"/>,
                title: 'Сделки',
                url: `/shops/deals`
            }
        ];

        return (
            <div className="nav-top shops-navigation">
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

export default ShopsNavigation;