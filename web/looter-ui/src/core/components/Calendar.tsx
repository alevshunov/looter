import * as React from 'react';
import * as moment from 'moment';
import './Calendar.css';
import { Moment } from 'moment';

class Calendar extends React.Component<{start: Date, end: Date, render: (data: Moment) => any}, {}> {
    render() {
        let realStart = moment(this.props.start).startOf('isoWeek');
        let realEnd = moment(this.props.end).endOf('isoWeek');

        let date = realStart;
        const parts = [];
        while (date <= realEnd) {
            parts.push(
                <div className={'day day-' + date.isoWeekday()} key={date.toString()}>
                    <div className={'day-container'}>
                        <div className={'day-title'}>
                            {date.locale('ru').format('DD MMMM')}
                        </div>
                        <div className={'day-content'}>
                            {this.props.render(date) || <div>&nbsp;</div>}
                        </div>
                    </div>
                </div>
            );
            date = date.add({ day: 1 });
        }

        return (
            <div>
                <div>
                    {parts}
                </div>
            </div>
        );
    }
}

export default Calendar;