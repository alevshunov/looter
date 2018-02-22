import * as React from 'react';
import './TableReport.css';

interface Props {
    cells: Array<{ title: string; field: string; }>;
    data: Array<{}>;
}

class TableReport extends React.Component<Props, {}> {

    render() {
        return (
            <div className="table-report-container">
                <table className="table-report">
                    <thead>
                        <tr>
                            <th className="table-report-cell header index">#</th>
                            {this.props.cells.map((cell, index) => (
                                <th className={'table-report-cell header' + cell.field} key={index}>
                                    {cell.title}
                                </th>
                            ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.props.data && this.props.data.map((item, index) => (
                                <tr key={index}>
                                    <td className="table-report-cell index" key={index}>{index + 1}</td>
                                    {
                                        this.props.cells.map((cell, index2) => (
                                            <td className={'table-report-cell ' + cell.field} key={index2}>
                                                {item[cell.field]}
                                            </td>
                                        ))
                                    }
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}

export default TableReport;
