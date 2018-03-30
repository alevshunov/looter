import * as React from 'react';
import * as numeral from 'numeral';

export default function(min: number, max?: number, format: string = '0,0') {
    if (!min && !max) {
        return <span>Отсутствует</span>;
    } else if (!max || min === max) {
        return <span className={'price-render'}>{numeral(min).format(format)} z</span>;
    } else {
        return (
            <span>
                <span className={'price-render'}>
                    {numeral(min).format(format)} z
                </span>
                {' - '}
                <span className={'price-render'}>
                    {numeral(max).format(format)} z
                </span>
            </span>);
    }
}