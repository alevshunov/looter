import * as React from 'react';
import './Container.css';

class Container extends React.Component {

    render() {
        return (
            <div className="container-shadow">
                {this.props.children}
            </div>
        );
    }
}

export default Container;