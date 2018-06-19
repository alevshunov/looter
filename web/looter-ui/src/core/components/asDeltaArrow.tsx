import * as React from 'react';
import './asDeltaArrow.css';

export default function(value: number) {
    return (
        <i className={value > 0 ? 'fas fa-long-arrow-alt-up ud-up' : 'fas fa-long-arrow-alt-down ud-down'} />
    );
}