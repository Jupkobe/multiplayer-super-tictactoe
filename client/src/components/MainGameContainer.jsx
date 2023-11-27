import React, { useState, useEffect, useRef } from 'react';
import { checkDiagonal, checkVertical, checkHorizontal } from "./checkFuncs";
import { generateBoardIdArray, generateEmptyBoardArray} from './resetFuncs';
import GameBoard from './GameBoard';
import Confetti from './Confetti';
import { socket } from "../socket";

// {
//   id: i,
//   winner: null,
//   game: [null, null, null, null, null, null, null, null, null]
//  [O, D, X,
//   X, D, O,
//   X, D, D]
// }

export default function MainGameContainer({ room }) {
  const [mainGame, setMainGame] = useState(() => generateEmptyBoardArray());
  const [nextPlayArray, setNextPlayArray] = useState([]);
  const [lastPlay, setLastPlay] = useState(null);
  const [winner, setWinner] = useState(null);
  const modal = useRef(null);
  const playerRef = useRef("");     // For socket.io useEffect
  const player = playerRef.current; // For other purposes

  useEffect(() => {
    socket.on("joined_room", serverPlayer => {
      playerRef.current = serverPlayer;
    });

    socket.on("sync", ({boardId, result}) => {
      setMainGame(prevMainGame => (prevMainGame.map(item => (
        item.id === boardId ? item = result : item
        )))
      );
    })

    socket.on("next_turn", ({ nextPlayer, nextPlayFromServer }) => {
      if (playerRef.current === nextPlayer) setNextPlayArray(nextPlayFromServer);
    });

    socket.on("game_over", winner => {
      setWinner(winner);
      openModal();
    })

  }, [socket]);
  
  
  function onPlay(boardId, boxId, result) {
    socket.emit("play", {
      cliRoom: room, 
      cliPlayer: player, 
      cliBoardId: boardId, 
      cliBoxId: boxId, 
      cliResult: result
    });
    
    setNextPlayArray([]);
  };

  // function resetGame() {    
  //   setMainGame(generateEmptyBoardArray());
  //   setLastPlay(null);
  //   setPlayer("X");
  //   setWinner(null);
  //   closeModal();
  // };

  // function gameOver() {
  //   setNextPlayArray([]);
  //   openModal();
  // };

  function openModal() {
    modal.current.showModal();
  };

  function closeModal() {
    modal.current.close();
  };
  
  const gameBoardElems = mainGame.map(item => {
    return (
    <GameBoard 
      key={item.id}
      id={item.id}
      game={item.game}
      winner={item.winner}
      player={player}
      isPlayable={nextPlayArray.includes(item.id)}
      onPlay={onPlay}
    />)
  });
  
  return (
    <>
      {winner && <Confetti />}
      <main className='flex flex-col items-center justify-center w-full min-h-screen p-3'>
        {/* <div className='flex flex-col items-center mb-4'>
          <h2 className='text-5xl font-bold text-[#0b0d40]'>{player && `${player}'s Turn`}</h2>
        </div> */}
        <section className='w-full sm:w-[37.75rem] sm:h-[37.75rem] p-1 sm:p-3 sm:justify-center sm:items-center bg-[#5068AB] rounded-md'>
          <div className='grid grid-cols-3 gap-1 sm:gap-2 aspect-square'>
            {gameBoardElems}
          </div>
        </section>
      </main>
      <dialog ref={modal}>
        <div className="flex flex-col items-center justify-center p-4 border border-black rounded w-80">
          <div className="w-full leading-6 text-[#0b0d40]">
            <h3 className="text-5xl font-bold text-center">{winner === "DRAW" ? "DRAW" : `${winner} wins!`}</h3>
            {winner === "DRAW" && <p className='mt-2 text-center'>You did it! You managed to break the game... almost.</p>}
          </div>
          <button onClick={() => {console.log("reset game pls")}} className="p-1 px-2 mt-6 border border-black">Reset</button>
        </div>
      </dialog>
    </>
  )
}