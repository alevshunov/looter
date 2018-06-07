import * as React from 'react';
import { NavLink } from 'react-router-dom';
import './WoENavigation.css';
import * as H from 'history';

class WoENavigation extends React.Component<{active?: string}> {

    constructor(props: { active: string }, context: any) {
        super(props, context);
    }

    isActive(match: any, location: H.Location, url: string) {
        return (location.pathname === url || location.pathname + '/' === url);
    }

    render() {
        const items = [
            {
                icon: <i className="fas fa-flag"/>,
                title: 'История ГВ',
                url: '/woe/'
            },
            {
                icon: <i className="fas fa-crown"/>,
                title: 'Гильдии',
                url: '/woe/guilds/'
            },
            {
                icon: <i className="fas fa-users"/>,
                title: 'Активные игроки',
                url: '/woe/players/'
            },
            {
                icon: <i className="fab fa-fort-awesome"/>,
                title: 'Замки',
                url: '/woe/castles/'
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