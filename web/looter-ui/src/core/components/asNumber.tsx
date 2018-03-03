import * as React from 'react';
import * as numeral from 'numeral';

export default function(value: number, postfix?: string) {
    const format = '0,0';
    return (
        <span>
            {numeral(value).format(format)}
            {postfix ? ' ' + postfix : ''}
        </span>
    );
}