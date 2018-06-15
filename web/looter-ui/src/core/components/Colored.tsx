import * as React from 'react';
import './Colored.css';

interface Props {
    value: number;
}

class Colored extends React.Component<Props> {
    render() {
        const {value} = this.props;

        let extraCls;

        if (value < 1200) {
            extraCls = 'level-d';
        } else if (value < 1400) {
            extraCls = 'level-c';
        } else if (value < 1600) {
            extraCls = 'level-b';
        } else {
            extraCls = 'level-a';
        }

        return (
            <span className={'colored ' + extraCls}>
                {this.props.children}
            </span>
        );

    }
}

export default Colored;