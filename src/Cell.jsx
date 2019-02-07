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
                <div className="cell-number">
                    <svg width="100%" height="100%" viewBox="0 0 50 100" xmlns="http://www.w3.org/2000/svg" version="1.1">
                        <text x="0" y="14">{clueNumber || ''}</text>
                    </svg>
                </div>
                <div className="cell-char">
                    <svg width="100%" height="100%" viewBox="0 0 14 18" xmlns="http://www.w3.org/2000/svg" version="1.1">
                        <text x="2" y="17">{value}</text>
                    </svg>
                </div>
            </>}
        </div>
    )
};

export default Cell;
