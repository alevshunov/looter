import * as React from 'react';
import * as numeral from 'numeral';

function isFloat(n: any) {
    return Number(n) === n && n % 1 !== 0;
}

export default function(value: number, postfix?: string) {
    const format = isFloat(value) && value < 100 ? '0,0.00' : '0,0';

    return (
        <span>
            {value ? numeral(value).format(format) : (postfix ? '-' : '')}
            {value && postfix ? ' ' + postfix : ''}
        </span>
    );
}