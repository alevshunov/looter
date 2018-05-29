import * as React from 'react';
import './Report24.css';
import asNumber from './asNumber';

interface Props {
    data: Array<number>;
    title?: string;
}

class Report24 extends React.Component<Props, {}> {

    render() {
        if (!this.props.data || !this.props.data.length) {
            return null;
        }

        let max = 0;
        this.props.data.forEach((x) => {
            max = Math.max(max, x);
        });

        return (
            <div className="report24">
                {this.props.title && <div className="report-24-title">{this.props.title}</div>}
                <div className="report24-container">
                    {
                        this.props.data && this.props.data.map((item, index) => {
                            return (
                                <div className="report24-item-container" key={index}>
                                    <div className="report24-item" style={{height: Math.round(item * 150 / max) }}>
                                        <div className="report24-item-label">{asNumber(item)}</div>
                                        <div
                                            className="report24-item-index"
                                            style={{marginTop: Math.round(item * 150 / max + 3) }}
                                        >
                                            {index}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

export default Report24;
