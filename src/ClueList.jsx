import React from 'react';
import classnames from 'classnames';

import './ClueList.css';

const ClueList = ({
    active,
    clues,
    displayText,
    selectedClueNumber,
    onClueClick,
}) => {
    function renderClues () {
        return Object.keys(clues).map(clue => (
            <li
                key={`${displayText}-${clue}`}
                className={classnames('clue-container', `${displayText}-${clue}`, {
                    'selected': Number(selectedClueNumber) === Number(clue),
                })}
                onClick={() => onClueClick(clue)}
            >
                <div className="clue-number">{clue}</div>
                <div className="clue-text">{clues[clue]['text']}</div>
            </li>
        ));
    }

    return (
        <div
            className={classnames('clue-list-container', {
                'active': active,
            })}
        >
            <div className="clue-list-display-text">{displayText}</div>
            <ul className="clue-list">{renderClues()}</ul>
        </div>
    )
};

export default ClueList;
