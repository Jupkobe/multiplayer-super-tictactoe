import { checkDiagonal, checkVertical, checkHorizontal, checkDraw } from "./checkFuncs";


export default function GameBoard({ boardId, onPlay, symbol, game, winner, isPlayable, lastPlay }) {
    const board = game;
    
    function handleClick(e, index) {
        e.stopPropagation();
        if (!isPlayable) return;
        else if (board[index] !== null) return;
        
        board[index] = symbol;
        
        const result = {
            boardId,
            winner: isOver(),
            game: board,
        }
    
        onPlay(boardId, index, result);
    };

    function isOver() {        
        if (checkHorizontal(board) || checkVertical(board) || checkDiagonal(board)) {
            return symbol;
        }
        else if (checkDraw(board)) {
            return "D";
        }
        else {
            return null;
        }
    }

    const buttonElems = board.map((value, index) => (
        <div
            key={index}
            onClick={(e) => handleClick(e, index)}
            className={`flex items-center justify-center w-full text-2xl sm:text-3xl text-[#0b0d40] 
            font-bold rounded-sm aspect-square animation ${isPlayable ? (lastPlay === index ? "bg-orange-200" : "bg-white") : (lastPlay === index ? "bg-orange-100" : "bg-gray-300")}`}
        >
            {value}
        </div>
    ))

    const blockElem = (
        <>
            <span className="absolute flex items-center justify-center w-full leading-none text-[#0b0d40] aspect-square text-[12rem]">{winner}</span>
            <div className="absolute w-full bg-gray-800 rounded-md opacity-50 aspect-square"></div>
        </>)

    return (
        <div className={`grid relative w-full grid-cols-3 gap-1 p-1 rounded-md aspect-square animation ${isPlayable ? "bg-[#131780]" : "bg-[#0b0d40]"}`}>
            {winner ? blockElem : null}
            {buttonElems}
        </div>
    )
  }