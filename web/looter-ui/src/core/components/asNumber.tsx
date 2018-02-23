import * as React from 'react';
import * as numeral from 'numeral';

export default function(value: number) {
    const format = '0,0';
    return <span>{numeral(value).format(format)}</span>;
}