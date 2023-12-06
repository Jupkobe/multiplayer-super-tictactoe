import { useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";

export default function UsernameModal({ onUsernameSelect, isConnecting, error, isOpen }) {
  const [inputUsername, setInputUsername] = useState("");
  const modal = useRef(null);

  useEffect(() => {
    isOpen ? modal.current.showModal() : modal.current.close();
  }, [isOpen]);

  return (
    <dialog onKeyDown={(e) => {if (e.key === 'Escape') e.preventDefault()}} className='rounded backdrop:bg-black backdrop:opacity-60' ref={modal}>
      <div className="flex flex-col items-center justify-center px-2 py-4 border border-black rounded">
        <p className='mb-1 text-lg font-medium'>Enter a username</p>
        {error && <p className='mb-2 text-red-500'>{error}</p>}
        <form className='flex gap-2' onSubmit={(e) => {e.preventDefault()}}>
          <input className='p-1 px-2 text-lg leading-none border border-black rounded-md shadow-sm outline-none sm:w-52 shadow-black' 
            required 
            maxLength="15" 
            disabled={isConnecting} 
            placeholder='Username' 
            onChange={(e) => setInputUsername(e.target.value)} />
          <button className="p-1 px-2 text-lg font-medium dialog-button" 
            onClick={(e) => {
            onUsernameSelect(inputUsername)}} 
            disabled={isConnecting}>Select</button>
        </form>
      </div>
    </dialog>
  );
}