import * as React from 'react';
import * as numeral from 'numeral';

export default function(start: number, end?: number, zeroMessage: string = '-') {
    const format = '0,0';
    if (start === end || end === undefined) {
        return <span className="counter">{numeral(start).format(format)} шт</span>;
    } else if (end === 0) {
        return <span className="counter">{zeroMessage} все {start} шт</span>;
    } else {
        return (
            <span className="counter">
                <span className="end">{numeral(end).format(format)}</span>{' из '}
                <span className="start">{numeral(start).format(format)} шт</span>
            </span>
        );
    }
}