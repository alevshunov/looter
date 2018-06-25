import * as React from 'react';
import './ValueWithArrow.css';
import asNumber from './asNumber';
import ifSet from './ifSet';

interface Props {
    value: number;
    delta: number;
    index: number;
    indexDelta?: number;
    userCls?: string;
}

class ValueWithArrow extends React.Component<Props> {
    render() {
        const {delta, value, userCls, index, indexDelta} = this.props;
        const isUpValue = delta >= 0;
        const isUpIndex = indexDelta && indexDelta >= 0;

        return (
            <div className={'with-arrow' + ifSet(userCls)}>
                {asNumber(value)}
                {' '}
                {
                    delta !== 0 &&
                    <i className={isUpValue ? 'fas fa-long-arrow-alt-up up' : 'fas fa-long-arrow-alt-down down'} />
                }
                {' '}
                #{asNumber(index)}
                {
                    (indexDelta !== undefined && indexDelta !== 0) &&
                    <span className={isUpIndex ? 'up' : 'down'}>
                        {' '}{isUpIndex ? '+' : '-'}{asNumber(Math.abs(indexDelta))}
                    </span>
                }
            </div>
        );

    }
}

export default ValueWithArrow;