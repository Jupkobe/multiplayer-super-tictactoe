import { useState, useEffect } from 'react';
import { socket } from "../socket";
import { generateEmptyBoardArray } from './resetFuncs';
import GameBoard from './GameBoard';

// {
//   boardId: i,
//   winner: null,
//   game: [null, null, null, null, null, null, null, null, null]
//  [O, D, X,
//   X, D, O,
//   X, D, D]
// }

export default function MainGameContainer({ roomId, username, focused }) {
  const [mainGame, setMainGame] = useState(() => generateEmptyBoardArray());
  const [nextPlayArray, setNextPlayArray] = useState([]);
  const [lastPlay, setLastPlay] = useState([-1, -1]);
  const [symbol, setSymbol] = useState("");
  const [turn, setTurn] = useState(null);
  let playedAudio = new Audio("/audios/opponent-played.mp3");
  
  useEffect(() => {
    socket.on("joined-room", ({ symbol }) => {
      setSymbol(symbol);
      setMainGame(generateEmptyBoardArray());
    });
    
    socket.on("sync", ({ boardId, result, lastPlay }) => {
      setMainGame(prevMainGame => (prevMainGame.map(item => (
          item.boardId === boardId ? item = result : item
      ))));
      setLastPlay(lastPlay);
    });

    socket.on("next-turn", ({ turn, nextPlayFromServer }) => {
      setTurn(turn);

      if (username === turn.username) {
        if (!focused) playedAudio.play();
        
        setNextPlayArray(nextPlayFromServer);
      }
    });

    socket.on("reset", () => {
      setMainGame(generateEmptyBoardArray());
      setNextPlayArray([]);
      setLastPlay([-1, -1]);
      symbol === "X" ? setSymbol("O") : setSymbol("X");
      setTurn(null);
    });

    () => {
      socket.off("joined-room");
      socket.off("sync");
      socket.off("next-turn");
      socket.off("reset");
      socket.disconnect();
    }
  }, [socket, username, roomId, symbol, focused]);
  
  function onPlay(boardId, boxId, result) {
    socket.emit("play", {
      cliRoomId: roomId, 
      cliPlayer: symbol, 
      cliBoardId: boardId, 
      cliBoxId: boxId, 
      cliResult: result
    });
    
    setNextPlayArray([]);
  };
  
  const gameBoardElems = mainGame.map(item => {
    return (
    <GameBoard 
      key={item.boardId}
      boardId={item.boardId}
      game={item.game}
      winner={item.winner}
      symbol={symbol}
      isPlayable={nextPlayArray.includes(item.boardId)}
      onPlay={onPlay}
      lastPlay={lastPlay[0] === item.boardId ? lastPlay[1] : -1}
    />)
  });
  
  return (
    <>
      <main className='flex flex-col items-center justify-center w-full min-h-screen p-3'>
        <div className='flex flex-col items-center mb-4'>
          <h2 className='text-5xl font-bold text-[#0b0d40]'>{turn && `(${turn.symbol}) ${turn.username}'s Turn`}</h2>
        </div>
        <section className='w-full sm:w-[37.75rem] sm:h-[37.75rem] p-1 sm:p-3 sm:justify-center sm:items-center bg-[#5068AB] rounded-md'>
          <div className='grid grid-cols-3 gap-1 sm:gap-2 aspect-square'>
            {gameBoardElems}
          </div>
        </section>
      </main>
    </>
  )
}
