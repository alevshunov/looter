import * as React from 'react';
import './TableReport.css';

interface Props {
    cells: Array<{ title: string; field: string; align?: string; render?: (value: any, obj?: any) => any}>;
    data: Array<Object> | undefined;
    rowExtraClass?: (obj?: any, index?: number) => string;
    title?: string;
    emptyMessage?: string;
    loadingMessage?: string;
}

class TableReport extends React.Component<Props, {}> {

    render() {
        return (
            <table className="table-report">
                <thead>
                    {this.props.title &&
                        <tr>
                            <th
                                colSpan={this.props.cells.length}
                                className={'table-report-cell header title'}
                            >
                                {this.props.title}
                            </th>
                        </tr>
                    }
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
                        !this.props.data &&
                        <tr className="table-row no-data">
                            <td colSpan={this.props.cells.length} className="table-report-cell">
                                {this.props.loadingMessage || 'Загрузка...'}
                            </td>
                        </tr>
                    }
                    {
                        this.props.data && this.props.data.length === 0 &&
                        <tr className="table-row no-data">
                            <td colSpan={this.props.cells.length} className="table-report-cell">
                                {this.props.emptyMessage || 'Данные отсутствуют'}
                            </td>
                        </tr>
                    }
                    {
                        this.props.data && this.props.data.map((item, index) => (
                            <tr key={index} className={(this.props.rowExtraClass || (() => ''))(item, index)}>
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
