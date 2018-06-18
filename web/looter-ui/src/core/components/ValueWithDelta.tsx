import * as React from 'react';
import './ValueWithDelta.css';
import asNumber from './asNumber';
import ifSet from './ifSet';

interface Props {
    value: number;
    delta: number;
    index?: any;
    userCls?: string;
    colorized?: boolean;
}

class ValueWithDelta extends React.Component<Props> {
    render() {
        if (!this.props.value) {
            return '';
        }

        const {delta, value, userCls, index, colorized} = this.props;
        const isUp = delta >= 0;
        let extraCls;

        if (colorized) {
            if (value < 1200) {
                extraCls = 'level-a';
            } else if (value < 1400) {
                extraCls = 'level-b';
            } else if (value < 1600) {
                extraCls = 'level-c';
            } else {
                extraCls = 'level-d';
            }
        }

        return (
            <div className={'as-delta' + ifSet(userCls) + ifSet(extraCls)}>
                <div className="value">
                    {asNumber(value)}
                </div>
                {delta !== 0 &&
                <div className={'delta ' + (isUp ? 'up' : 'down')}>
                    {isUp ? ' + ' : ' - '}{asNumber(Math.abs(delta))}
                </div>
                }
                <div className="index">
                    {ifSet(index, ' #')}
                </div>
            </div>
        );

    }
}

export default ValueWithDelta;