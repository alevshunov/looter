import * as React from 'react';
import MyNavigation from '../components/MyNavigation';
import WoENavigation from './components/WoENavigation';

class WoELayout extends React.Component {

    render() {
        return (
            <div className="limiter">
                <MyNavigation/>
                <WoENavigation/>
                {this.props.children}
            </div>
        );
    }
}

export default WoELayout;