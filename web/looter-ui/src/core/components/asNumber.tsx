import * as React from 'react';
import * as numeral from 'numeral';

export default function(value: number, postfix?: string, format?: string) {
    format = format || '0,0';
    return (
        <span>
            {value ? numeral(value).format(format) : '-'}
            {postfix ? ' ' + postfix : ''}
        </span>
    );
}