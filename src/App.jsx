import React, { useState, useEffect } from 'react';
import produce from 'immer';
import {
    getNextLocale,
    getNextEmptyLocale,
    getPrevLocale,
    isBoardFilled,
    setupBoard,
} from './util/board';
import './App.css';

import Cell from './Cell';

const App = ({
    boardWidth,
    rawBoard,
}) => {
    const trimmedBoard = rawBoard.replace(/[^01]/gm, '');
    const board = setupBoard(boardWidth, trimmedBoard);

    const [cellValues, setCellValues] = useState({});
    const [currLocale, setLocale] = useState(Object.keys(board.cells)[0]);
    const [orientation, setOrientation] = useState('across');

    let boardRef = React.createRef();

    function toggleOrientation (locale = currLocale) {
        if (locale !== currLocale) {
            setLocale(locale);
        } else {
            setOrientation(
                orientation === 'across'
                    ? 'down'
                    : 'across'
            );
        }
    }

    function renderCells () {
        const clue = board.cells[currLocale][orientation];
        const activeCells = board[orientation][clue]['cells'];
        const rendered = [];

        for (let i = 0; i < trimmedBoard.length / boardWidth; i++) {
            for (let j = 0; j < boardWidth; j++) {
                const locale = `${i},${j}`;
                const cell = board.cells[locale];

                rendered.push(
                    <Cell
                        key={locale}
                        value={cellValues[locale]}
                        clueNumber={cell && cell.leadCell}
                        block={typeof cell === 'undefined'}
                        active={activeCells.includes(locale)}
                        selected={locale === currLocale}
                        onClick={() => toggleOrientation(locale)}
                    />
                )
            }
        }

        return rendered;
    }

    function updateLocaleByValues (values, direction) {
        const localeGetter = direction === 'next'
            ? getNextLocale
            : getPrevLocale;

        setLocale(
            localeGetter(
                board,
                orientation,
                currLocale,
                values
            )
        );
    }

    function handleKeyDown (key, e) {
        if (key.length === 1) {
            const nextCellValues = produce(cellValues, draft => {
                draft[currLocale] = key;
            });

            setCellValues(nextCellValues);
            setLocale(
                getNextEmptyLocale(
                    board,
                    orientation,
                    currLocale,
                    nextCellValues
                )
            );
        }

        switch (key) {
            case 'Backspace':
            case 'Delete':
                // stop history goBack
                e.preventDefault();

                const prevCellValues = produce(cellValues, draft => {
                    delete draft[currLocale];
                });

                setCellValues(prevCellValues);
                updateLocaleByValues(prevCellValues, 'prev');
                break;
            case 'ArrowLeft':
                if (orientation === 'across') {
                    updateLocaleByValues(cellValues, 'prev');
                } else {
                    toggleOrientation();
                }
                break;
            case 'ArrowRight':
                if (orientation === 'across') {
                    updateLocaleByValues(cellValues, 'next');
                } else {
                    toggleOrientation();
                }
                break;
            case 'ArrowUp':
                if (orientation === 'down') {
                    updateLocaleByValues(cellValues, 'prev');
                } else {
                    toggleOrientation();
                }
                break;
            case 'ArrowDown':
                if (orientation === 'down') {
                    updateLocaleByValues(cellValues, 'next');
                } else {
                    toggleOrientation();
                }
                break;
            default:
                return null;
        }
    }

    useEffect(() => {
        // add focus on mount
        // to ensure keydown event handling
        boardRef.current.focus();
    }, []);

    return (
        <div
            className="board-container"
            style={{
                gridTemplateColumns: `repeat(${boardWidth}, 50px)`,
                width: 51 * boardWidth - 1,
            }}
            ref={boardRef}
            tabIndex="0" // necessary for key press event handling
            onKeyDown={e => handleKeyDown(e.key, e)}
        >
            {renderCells()}
            {
                isBoardFilled(board.cells, cellValues) &&
                <div>All done!</div>
            }
        </div>
    )
};

export default App;
