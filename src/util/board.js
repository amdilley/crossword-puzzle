import _pickBy from 'lodash.pickby';

const isAcrossLead = (w, index, board) =>
    index % w
        ? board.charAt(index - 1) === '0'
        : true;

const isDownLead = (w, index, board) =>
    Math.floor(index / w)
        ? board.charAt(index - w) === '0'
        : true;

const getAcrossNumber = (row, col, cells) => {
    while (cells.hasOwnProperty(`${row},${col - 2}`)) {
        col--;
    }

    return cells[`${row},${col - 1}`]['leadCell'];
};

const getDownNumber = (row, col, cells) => {
    while (cells.hasOwnProperty(`${row - 2},${col}`)) {
        row--;
    }

    return cells[`${row - 1},${col}`]['leadCell'];
};

const getAcrossClueCells = (clue, cells) =>
    Object.keys(_pickBy(cells, c => c['across'] === clue));

const getDownClueCells = (clue, cells) =>
    Object.keys(_pickBy(cells, c => c['down'] === clue));

const rotateArray = (arr, index = 0) =>
    arr.slice(index).concat(arr.slice(0, index));

const getClueNumber = (cells, orientation, locale) =>
    cells[locale][orientation];

const getFirstLocaleByFilter = (
    inlineCells,
    startLocale,
    filter = () => true,
    isReversed = false
) => {
    const arr = isReversed ? inlineCells.reverse() : inlineCells;
    const rotationIndex = Math.max(startLocale && arr.indexOf(startLocale), 0);

    return rotateArray(arr, rotationIndex).filter(filter)[0];
};

export const isBoardFilled = (cells, cellValues) =>
    Object.keys(cells).length === Object.keys(cellValues).length;

const getUpdatedLocaleFactory = (direction, withWrap = true) => (board, orientation, locale, cellValues) => {
    const isPrev = direction === 'prev';
    let currClueNum;
    let currClue;
    let currInlineCells;
    let localeIndex;
    let updatedLocale;
    let isFirstPass = true;

    while (!updatedLocale) {
        // stay at current clue if no prev/next exists
        if ((currClue && !currClue[direction]) || isBoardFilled(board.cells, cellValues)) {
            return locale;
        }

        currClueNum = isFirstPass
            ? getClueNumber(board.cells, orientation, locale)
            : currClue[direction];
        currClue = board[orientation][currClueNum];
        currInlineCells = currClue['cells'];
        localeIndex = currInlineCells.indexOf(locale);
        updatedLocale = getFirstLocaleByFilter(
            // return whole array on wrap or
            // if jumping to previous clue
            (withWrap || (isPrev && localeIndex === -1))
                ? currInlineCells
                : isPrev
                    ? currInlineCells.slice(0, localeIndex)
                    : currInlineCells.slice(localeIndex + 1),
            isFirstPass && locale,
            l => isPrev === cellValues.hasOwnProperty(l) || !withWrap,
            isPrev
        );
        isFirstPass = false;
    }

    return updatedLocale;
};

export const getPrevLocale = getUpdatedLocaleFactory('prev', false);
export const getPrevFilledLocale = getUpdatedLocaleFactory('prev');
export const getNextLocale = getUpdatedLocaleFactory('next', false);
export const getNextEmptyLocale = getUpdatedLocaleFactory('next');

export const setupBoard = (w, board) => {
    if (board.length % w) {
        throw new Error('board data does not match provided dimensions');
    }

    const across = {};
    const down = {};
    const cells = {};
    
    let clueIndex = 0;
    let acrossIndex = 0;
    let downIndex = 0;
    let prevAcross = null;
    let prevDown = null;

    for (let i = 0; i < board.length; i++) {
        if (board.charAt(i) === '0') {
            continue;
        }

        const newAcross = isAcrossLead(w, i, board);
        const newDown = isDownLead(w, i, board);
        const newLeadCell = newAcross || newDown;
        const row = Math.floor(i / w);
        const col = i % w;
        const cellLocale = `${row},${col}`;

        if (newLeadCell) {
            clueIndex++;
        }

        // add to across metadata if left cell
        // doesn't exist or is blocked cell
        if (newAcross) {
            acrossIndex = clueIndex

            if (prevAcross) {
                across[prevAcross]['next'] = clueIndex;
            }

            across[clueIndex] = {
                locale: cellLocale,
                prev: prevAcross,
            };

            prevAcross = clueIndex;
        }

        // add to down metadata if top cell
        // doesn't exist or is blocked cell
        if (newDown) {
            downIndex = clueIndex

            if (prevDown) {
                down[prevDown]['next'] = clueIndex;
            }

            down[clueIndex] = {
                locale: cellLocale,
                prev: prevDown,
            };

            prevDown = clueIndex;
        }

        cells[cellLocale] = {
            across: newAcross ? clueIndex : getAcrossNumber(row, col, cells),
            down: newDown ? clueIndex : getDownNumber(row, col, cells),
            leadCell: newLeadCell ? clueIndex : 0,
        };
    }

    for (let clue in across) {
        across[clue]['cells'] = getAcrossClueCells(Number(clue), cells);
    }

    for (let clue in down) {
        down[clue]['cells'] = getDownClueCells(Number(clue), cells);
    }

    // wrap first and last clues
    across[acrossIndex]['next'] = 1;
    across[1]['prev'] = acrossIndex;
    down[downIndex]['next'] = 1;
    down[1]['prev'] = downIndex;

    return {
        across,
        down,
        cells,
    };
};
