import { useEffect, useState, useRef } from 'react'
import { socket } from "../socket";

export default function Dialog({ roomId, setRoomId, username, setUsername, winner }) {
  const [isConnecting, setIsConnecting] = useState(false);
  // const [isConnected, setIsConnected] = useState(false);
  // const [isUsernameSelected, setIsUsernameSelected] = useState(false);
  const [input, setInput] = useState({    
    roomId: "",
    username: "",
  });
  const [error, setError] = useState(null);
  const usernameModal = useRef(null);
  const newGameModal = useRef(null);
  const inviteModal = useRef(null);
  const winnerModal = useRef(null);

  useEffect(() => {
    // URL PARAM CONTROL
    // IF URL IS VALID THEN input.roomId = URL...
    // IF NOT GO AS USUAL

    socket.on("welcome", () => {
      openModal(usernameModal);
    })

    socket.on("invite-friend", () => {
      closeModal(newGameModal);
      setIsConnecting(false);
      openModal(inviteModal);
    });

    socket.on("game-ready", () => {
      setIsConnecting(false);
      closeModal(newGameModal);
      closeModal(inviteModal);
      closeModal(usernameModal);
      closeModal(winnerModal);
    });

    socket.on("game-over", () => {
      openModal(winnerModal);
    });

    // ERROR HANDLING
    socket.on("error", (errorMsg) => {
      showAlert(errorMsg);
      setIsConnecting(false);
    });

    () => {
      socket.off("invite-friend");
      socket.off("game-ready");
      socket.off("game-over");
      socket.off("error");
      socket.disconnect();
    }
  }, [socket]);

  function onReset(e) {   
    e.preventDefault();
     
    socket.emit("reset-request", roomId, username);
  };  
  
  function onUsernameSelect(e) {
    e.preventDefault();

    setUsername(input.username);

    closeModal(usernameModal);
    openModal(newGameModal);
  }

  function onClickJoin(e) {
    e.preventDefault();

    setIsConnecting(true);
    socket.emit("join-room", input.roomId, username);
  }

  function onClickNewGame(e, selection) {
    e.preventDefault();

    setIsConnecting(true);
    socket.emit("create-room", selection, username);
  }

  function openModal(modal) {
    // switch (modal) {
    //   case usernameModal:
    //     openModal(usernameModal);
    //     closeModal(inviteModal);
    //     closeModal(newGameModal);
    //   case inviteModal:
    //     openModal(inviteModal);
    //     closeModal(usernameModal);
    //     closeModal(newGameModal);
    //   case newGameModal:
    //     openModal(newGameModal);
    //     closeModal(inviteModal);
    //     closeModal(usernameModal);
    // }
    modal.current.showModal();
  };

  function closeModal(modal) {
    modal.current.close();
  };

  function showAlert(errorMsg) {
    setError(errorMsg);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  async function copyToClipboard(e) {
    const value = roomId;
    navigator.clipboard.writeText(value);
    
    e.target.value = "copied!";
    setTimeout(() => {
      e.target.value = value;
    }, 750);
  };

  const usernameComponent = (      
    <dialog onKeyDown={(e) => {if (e.key === 'Escape') e.preventDefault()}} className='rounded backdrop:bg-black backdrop:opacity-60' ref={usernameModal}>
      <div className="flex flex-col items-center justify-center px-2 py-4 border border-black rounded">
        <p className='mb-2 text-lg font-medium'>Enter a username</p>
        <form className='flex gap-2' onSubmit={onUsernameSelect}>
          <input className='p-1 px-2 text-lg leading-none border border-black rounded-md shadow-sm outline-none sm:w-52 shadow-black' required 
            maxLength="15" 
            disabled={isConnecting} 
            placeholder='Username' 
            onChange={(e) => setInput(prevInput => ({
              ...prevInput,
              username: e.target.value
            }))}/>
          <button className="p-1 px-2 text-lg font-medium dialog-button" disabled={isConnecting}>{"Select"}</button>
        </form>
      </div>
    </dialog>
  );

  const newGameComponent = (
    <dialog onKeyDown={(e) => {if (e.key === 'Escape') e.preventDefault()}} className='rounded backdrop:bg-black backdrop:opacity-60' ref={newGameModal}>
      <div className="flex flex-col items-center justify-center rounded px-2 py-4 border border-black sm:min-w-[24rem]">
        <p className='text-xl font-medium'>Join to your friend</p>
        {error && <p className='mt-1 text-red-500'>{error}</p>}
        <form className='flex justify-center gap-1 mt-2' onSubmit={onClickJoin}>
          <input className='w-40 p-1 px-2 text-lg leading-none border border-black rounded-md shadow-sm outline-none shadow-black sm:w-44' required 
            maxLength="5"
            disabled={isConnecting} 
            placeholder='Room ID' 
            onChange={(e) => {
              setInput(prevInput => ({
                ...prevInput,
                roomId: e.target.value,
              }))}}/>
          <button className="p-1 px-2 text-lg font-medium border border-black rounded-md dialog-button" disabled={isConnecting}>Join</button>
        </form>
        <p className='mt-2 text-lg'>or</p>
        <p className='mt-1 text-xl font-medium'>Create a room</p>
        <div className='grid w-full grid-cols-3 gap-5 px-8 py-2 sm:gap-4'>
          <button onClick={(e) => {
            onClickNewGame(e, "X")
          }} disabled={isConnecting} className='p-4 text-3xl font-semibold leading-none sm:text-5xl aspect-square dialog-button'>X</button>
          <button onClick={(e) => {
            onClickNewGame(e, "?")
          }} disabled={isConnecting} className='p-4 text-3xl font-semibold leading-none sm:text-5xl aspect-square dialog-button'>?</button>
          <button onClick={(e) => {
            onClickNewGame(e, "O")
          }} disabled={isConnecting} className='p-4 text-3xl font-semibold leading-none sm:text-5xl aspect-square dialog-button'>O</button>
        </div>
      </div>
    </dialog>
  );

  const winnerComponent = ( //FIX RESET
    <dialog onKeyDown={(e) => {if (e.key === 'Escape') e.preventDefault()}} className='rounded backdrop:bg-black backdrop:opacity-60' ref={winnerModal}>
      <div className="flex flex-col items-center justify-center p-4 border border-black rounded sm:min-w-[24rem]">
        <div className="w-full leading-6 text-[#0b0d40]">
          <h3 className="text-5xl font-bold text-center">{winner === "DRAW" ? "DRAW!" : `${winner} wins!`}</h3>
          {winner === "DRAW" && <p className='mt-2 text-center'>You did it! You managed to break the game... almost.</p>}
        </div>
        <button onClick={onReset} className="p-1 px-2 mt-6 dialog-button">Reset</button>
      </div>
    </dialog>
  );

  const inviteComponent = (
    <dialog onKeyDown={(e) => {if (e.key === 'Escape') e.preventDefault()}} className='rounded backdrop:bg-black backdrop:opacity-60' ref={inviteModal}>
      <div className="flex flex-col items-center justify-center w-full px-2 py-4 border border-black rounded sm:w-80">
        {/* <p className='mb-2 text-lg font-medium'>Share this link!</p>
        <form className='flex gap-2' >
          <input onClick={copyToClipboard} disabled className='p-1 px-2 text-lg leading-none border border-black rounded-md shadow-sm outline-none sm:w-52 shadow-black'/>
        </form> */}
        <p className='mb-2 text-lg font-medium'>Share this ID!</p>
        <form className='flex gap-2' >
          <input onClick={copyToClipboard} value={roomId} readOnly className='p-1 px-2 text-lg leading-none text-center border border-black rounded-md shadow-sm outline-none hover:cursor-pointer sm:w-52 shadow-black'/>
        </form>
      </div>
    </dialog>
  )  

  return (
    <>
      {usernameComponent}
      {newGameComponent}
      {inviteComponent}
      {winnerComponent}
    </>
  )
}