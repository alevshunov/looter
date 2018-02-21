import * as React from 'react';
import * as numeral from 'numeral';

export default function(min: number, max?: number) {
    const format = '0,0';
    if (!max || min === max) {
        return <span>{numeral(min).format(format)} z</span>;
    } else {
        return <span>{numeral(min).format(format)} z - {numeral(max).format(format)} z</span>;
    }
}