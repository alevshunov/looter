import * as React from 'react';
import { NavLink } from 'react-router-dom';
import * as H from 'history';
import './DealsNavigation.css';

class DealsNavigation extends React.Component<{itemName: string}> {

    constructor(props: any, context: any) {
        super(props, context);
    }

    isActive(match: any, location: H.Location, url: string) {
        return (location.pathname === url || location.pathname + '/' === url);
    }

    render() {
        const items = [
            {
                icon: <i className="fas fa-shopping-cart"/>,
                title: 'История продаж',
                url: `/item/${this.props.itemName}/deals/sold`
            },
            {
                icon: <i className="fas fa-cart-arrow-down"/>,
                title: 'История покупок',
                url: `/item/${this.props.itemName}/deals/bought`
            }
        ];

        return (
            <div className="nav-top deal-navigation">
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

export default DealsNavigation;