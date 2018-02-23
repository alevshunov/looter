import * as React from 'react';
import './TableReport.css';

interface Props {
    cells: Array<{ title: string; field: string; align?: string; render?: (value: any, obj?: any) => any}>;
    data: Array<Object>;
}

class TableReport extends React.Component<Props, {}> {

    render() {
        return (
            <table className="table-report">
                <thead>
                    <tr>
                        {this.props.cells.map((cell, index) => (
                            <th
                                className={'table-report-cell header ' + (cell.align || 'left') + ' ' + cell.field}
                                key={index}
                            >
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
                                {
                                    this.props.cells.map((cell, index2) => (
                                        <td
                                            className={
                                                'table-report-cell data ' + (cell.align || 'left') + ' ' + cell.field
                                            }
                                            key={index2}
                                        >
                                            {
                                                cell.field === 'index' ?
                                                    index + 1 :
                                                    (cell.render || ((x) => x))(item[cell.field], item)
                                            }
                                        </td>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        );
    }
}

export default TableReport;
