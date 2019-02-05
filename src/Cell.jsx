import React from 'react';
import classnames from 'classnames';

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
                <div className="cell-char">{value}</div>
            </>}
        </div>
    )
};

export default Cell;

