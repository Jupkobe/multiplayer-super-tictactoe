function checkHorizontal(board) {
    for (let i = 0; i < 3; i++) {
        if (board[i * 3] !== null && board[i * 3] !== "D") {
            if (board[i * 3] === board[i * 3 + 1] && board[i * 3 + 1] === board[i * 3 + 2]) {
                return true;
            }
        } continue;
    }
    return false;
}

function checkVertical(board) {
    for (let i = 0; i < 3; i++) {
        if (board[i] !== null && board[i] !== "D") {
            if (board[i] == board[3 + i] && board[3 + i] == board[6 + i]) return true;
        } continue;
    }
    return false;
}

function checkDiagonal(board) {
    if (board[4] !== null && board[4] !== "D") {
        if ((board[0] === board[4] && board[4] === board[8]) || (board[2] === board[4] && board[4] === board[6])) return true;
    } 
    return false;
}

function checkDraw(board) {
    return board.every(value => value !== null);
}

module.exports = {checkHorizontal, checkVertical, checkDiagonal, checkDraw}
