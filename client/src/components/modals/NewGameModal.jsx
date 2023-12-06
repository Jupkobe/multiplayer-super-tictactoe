import { useState, useRef, useEffect } from 'react';

export default function NewGameModal({ error, onClickJoin, isConnecting, onClickNewGame, isOpen }) {
  const [inputRoomId, setInputRoomId] = useState("");
  const modal = useRef(null);

  useEffect(() => {
    isOpen ? modal.current.showModal() : modal.current.close();
  }, [isOpen]);

  return (      
    <dialog onKeyDown={(e) => {if (e.key === 'Escape') e.preventDefault()}} className='rounded backdrop:bg-black backdrop:opacity-60' ref={modal}>
      <div className="flex flex-col items-center justify-center rounded px-2 py-4 border border-black sm:min-w-[24rem]">
        <p className='text-xl font-medium'>Join to your friend</p>
        {error && <p className='mt-1 text-red-500'>{error}</p>}
        <form className='flex justify-center gap-1 mt-2' onSubmit={(e) => {
          e.preventDefault();
          onClickJoin(inputRoomId);
        }}>
          <input className='w-40 p-1 px-2 text-lg leading-none border border-black rounded-md shadow-sm outline-none shadow-black sm:w-44' 
            required 
            maxLength="5"
            disabled={isConnecting} 
            placeholder='Room ID' 
            onChange={(e) => {setInputRoomId(e.target.value)}}
          />
          <button className="p-1 px-2 text-lg font-medium border border-black rounded-md dialog-button" disabled={isConnecting}>Join</button>
        </form>
        <p className='mt-2 text-lg'>or</p>
        <p className='mt-1 text-xl font-medium'>Create a room</p>
        <div className='grid w-full grid-cols-3 gap-5 px-8 py-2 sm:gap-4'>
          <button 
            onClick={() => {onClickNewGame("X")}} 
            disabled={isConnecting} 
            className='p-4 text-3xl font-semibold leading-none sm:text-5xl aspect-square dialog-button'>X</button>
          <button 
            onClick={() => {onClickNewGame("?")}} 
            disabled={isConnecting} 
            className='p-4 text-3xl font-semibold leading-none sm:text-5xl aspect-square dialog-button'>?</button>
          <button 
            onClick={() => {onClickNewGame("O")}} 
            disabled={isConnecting} 
            className='p-4 text-3xl font-semibold leading-none sm:text-5xl aspect-square dialog-button'>O</button>
        </div>
      </div>
    </dialog>
  );
}