import * as React from 'react';
import './TableReport.css';

interface Props {
    cells: Array<{ title: any; field: string; align?: string; render?: (value: any, obj?: any) => any}>;
    data: Array<Object> | undefined;
    rowExtraClass?: (obj?: any, index?: number) => string;
    title?: string;
    emptyMessage?: string;
    loadingMessage?: string;
}

class TableReport extends React.Component<Props, {}> {

    constructor(props: Props, context: any) {
        super(props, context);
        this.handleThRef = this.handleThRef.bind(this);
        this.handleSort = this.handleSort.bind(this);
    }

    handleSort(cell: any) {
        console.log(cell);
    }

    handleThRef(cell: any, ref: any) {
        console.log(cell, ref);

        if (!ref) {
            return;
        }

        if (cell.__ref) {
            cell.__ref.removeEventListener('click', cell.__fn);
        }

        cell.__ref = ref;
        cell.__fn = this.handleSort.bind(cell);
        cell.__ref.addEventListener('click', cell.__fn);
    }

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
                                ref={(ref) => this.handleThRef(cell, ref)}
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
