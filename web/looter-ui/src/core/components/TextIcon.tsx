import * as React from 'react';
import './TextIcon.css';
import { Link } from 'react-router-dom';

class TextIcon extends React.Component<{linkUrl: string, iconUrl: string}> {
    render() {
        return (
            <span className={'text-icon'}>
                <Link to={this.props.linkUrl} className={'icon-wrapper'}>
                    <img src={this.props.iconUrl} />
                </Link>
                <span className={'text-wrapper'}>
                    {this.props.children}
                </span>
            </span>
        );
    }
}

export default TextIcon;