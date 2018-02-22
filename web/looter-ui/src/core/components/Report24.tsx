import * as React from 'react';
import './Report24.css';

interface Props {
    data: Array<number>;
}

class Report24 extends React.Component<Props, {}> {

    render() {
        let max = 0;
        this.props.data.forEach((x) => {
            max = Math.max(max, x);
        });

        return (
            <div className="report24-container">
                {
                    this.props.data && this.props.data.map((item, index) => {
                        return (<div className="report24-item-container"   key={index}>
                                <div className="report24-item" style={{height: Math.round(item * 150 / max) }}/>
                            </div>);
                    })
                }
            </div>
        );
    }
}

export default Report24;
