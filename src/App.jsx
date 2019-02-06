import React from 'react';
import { setupBoard } from './util/board';
import Board from './Board';
import './App.css';

const App = ({
    boardWidth,
    rawBoard,
}) => {
    const trimmedBoard = rawBoard.replace(/[^01]/gm, '');
    const board = setupBoard(boardWidth, trimmedBoard);

    return (
        <div className="crossword-puzzle-container">
            <Board
                board={board}
                boardWidth={boardWidth}
                boardHeight={trimmedBoard.length / boardWidth}
            />
        </div>
    );
};

export default App;
