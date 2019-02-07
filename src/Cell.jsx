import React from 'react';
import classnames from 'classnames';

import './Cell.css';

const Cell = ({
    value,
    clueNumber,
    block,
    active,
    selected,
    onClick,
}) => {
    return (
        <div
            className={classnames('cell', {
                'blocked': block,
                'active': active,
                'selected': selected,
            })}
            onClick={onClick}
        >
            {!block && <>
                <div className="cell-number">{clueNumber || ''}</div>
                <div className="cell-char">
                    <svg viewBox="0 0 14 18">
                        <text x="2" y="17">{value}</text>
                    </svg>
                </div>
            </>}
        </div>
    )
};

export default Cell;
