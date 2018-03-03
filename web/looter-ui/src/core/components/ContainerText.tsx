import * as React from 'react';
import './ContainerText.css';

class ContainerText extends React.Component {

    render() {
        return (
            <div className={'container-text'}>
                {this.props.children}
            </div>
        );
    }
}

export default ContainerText;