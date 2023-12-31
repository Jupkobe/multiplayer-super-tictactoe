import { useEffect, useState, useRef } from 'react';
import { socket } from "../../socket";

export default function WinnerModal({ winner }) {
  const [resetCount, setResetCount] = useState(0);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    socket.on("reset-count", (count) => {
      setResetCount(count);
    })

    socket.on("reset", () => {
      setResetCount(0);
      setClicked(false);
    });

    () => {
      socket.off("reset-count");
      socket.off("reset");
      socket.disconnect();
    }
  }, [socket]);

  function onReset() {
    setClicked(true);
    socket.emit("reset-request", socket.roomId);
  };  

  return (
    <div className="flex flex-col items-center justify-center p-4 border border-black rounded sm:min-w-[24rem]">
      <div className="w-full leading-6 text-[#0b0d40]">
        <h3 className="text-5xl font-bold text-center">{winner === "DRAW" ? "DRAW!" : `${winner} wins!`}</h3>
        {winner === "DRAW" && <p className='mt-2 text-center'>You did it! You managed to break the game... almost.</p>}
      </div>
      <button onClick={onReset} className="p-1 px-2 mt-6 dialog-button" disabled={clicked}>{`Reset (${resetCount}/2)`}</button>
    </div>
  );
}