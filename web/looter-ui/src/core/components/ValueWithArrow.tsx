import * as React from 'react';
import './ValueWithArrow.css';
import asNumber from './asNumber';
import ifSet from './ifSet';

interface Props {
    value: number;
    delta: number;
    index: number;
    userCls?: string;
}

class ValueWithArrow extends React.Component<Props> {
    render() {
        const {delta, value, userCls, index} = this.props;
        const isUp = delta >= 0;

        return (
            <div className={'with-arrow' + ifSet(userCls)}>
                {asNumber(value)}
                {' '}
                {
                    delta !== 0 &&
                    <i className={isUp ? 'fas fa-long-arrow-alt-up up' : 'fas fa-long-arrow-alt-down down'} />
                }
                {' '}
                #{asNumber(index)}
            </div>
        );

    }
}

export default ValueWithArrow;