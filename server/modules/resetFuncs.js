function generateEmptyBoardArray() {
    const emptyBoard = [];
    for (let i = 0; i < 9; i++) {
      emptyBoard.push({
        boardId: i,
        winner: null,
        game: [null, null, null, null, null, null, null, null, null]
      });
    }
    return emptyBoard;
}

function generateBoardIdArray() {
    const emptyBoard = [];
    for (let i = 0; i < 9; i++) {
        emptyBoard.push(i);
    }
    return emptyBoard;
}

module.exports = {generateEmptyBoardArray, generateBoardIdArray};
