import { useEffect, useState, useRef } from 'react'
import { socket } from "../socket";

export default function usernameComponent({ roomId, setRoomId, onUsernameSelect, isConnecting }) {
  const [inputUsername, setInputUsername] = useState("");

  return (      
    <dialog onKeyDown={(e) => {if (e.key === 'Escape') e.preventDefault()}} className='rounded backdrop:bg-black backdrop:opacity-60'>
      <div className="flex flex-col items-center justify-center px-2 py-4 border border-black rounded">
        <p className='mb-2 text-lg font-medium'>Enter a username</p>
        <form className='flex gap-2' onSubmit={onUsernameSelect}>
          <input className='p-1 px-2 text-lg leading-none border border-black rounded-md shadow-sm outline-none sm:w-52 shadow-black' required 
            maxLength="15" 
            disabled={isConnecting} 
            placeholder='Username' 
            onChange={(e) => setUsername(e.target.value)} />
          <button className="p-1 px-2 text-lg font-medium dialog-button" disabled={isConnecting}>{"Select"}</button>
        </form>
      </div>
    </dialog>
  );
}