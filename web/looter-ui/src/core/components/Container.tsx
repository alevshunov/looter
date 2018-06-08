import * as React from 'react';
import './Container.css';

class Container extends React.Component<{userCls?: string}> {

    render() {
        return (
            <div className={'container-shadow ' + (this.props.userCls || '')}>
                {this.props.children}
            </div>
        );
    }
}

export default Container;