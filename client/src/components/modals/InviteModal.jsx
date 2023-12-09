import { useRef, useEffect } from 'react';
import { socket } from "../../socket";

export default function InviteModal({ isOpen }) {
  const modal = useRef(null);

  useEffect(() => {
    isOpen ? modal.current.showModal() : modal.current.close();
  }, [isOpen]);

  function copyToClipboard(e) {
    const value = e.target.value;

    navigator.clipboard.writeText(value);
    
    e.target.value = "copied!";
    setTimeout(() => {
      e.target.value = value;
    }, 750);
  };

  return (      
    <dialog onKeyDown={(e) => {if (e.key === 'Escape') e.preventDefault()}} className='rounded backdrop:bg-black backdrop:opacity-60' ref={modal}>
      <div className="flex flex-col items-center justify-center w-full px-2 py-4 border border-black rounded sm:w-80">
        <p className='mb-2 text-lg font-medium'>Share this link!</p>
        <form className='flex gap-2'>
          <input onClick={copyToClipboard} value={`${window.location.href}?roomId=${socket.roomId}`} readOnly className='p-1 px-2 text-lg leading-none text-center border border-black rounded-md shadow-sm outline-none hover:cursor-pointer sm:w-52 shadow-black'/>
        </form>
        <p className='mt-2 text-lg'>or</p>
        <p className='mb-2 text-lg font-medium'>Share this ID!</p>
        <form className='flex gap-2'>
          <input onClick={copyToClipboard} value={`${socket.roomId}`} readOnly className='p-1 px-2 text-lg leading-none text-center border border-black rounded-md shadow-sm outline-none hover:cursor-pointer sm:w-52 shadow-black'/>
        </form>
      </div>
    </dialog>
  );
}
