import * as React from 'react';
import MyNavigation from '../components/MyNavigation';
import ShopsNavigation from './ShopsNavigation';
// import WoENavigation from '../components/WoENavigation';

class ShopsLayout extends React.Component {

    render() {
        return (
            <div className="limiter">
                <MyNavigation/>
                <ShopsNavigation/>
                {/*<WoENavigation/>*/}
                {this.props.children}
            </div>
        );
    }
}

export default ShopsLayout;