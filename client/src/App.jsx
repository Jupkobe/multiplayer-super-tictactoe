import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MainGameContainer from './components/MainGameContainer';
import { useEffect, useState, useRef } from 'react';
import {socket} from "./socket";

export default function App() {
  const [room, setRoom] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const roomModal = useRef(null);

  useEffect(() => {
    if (!isConnected) openModal();
    
    socket.on("joined_room", () => {
      setIsConnected(true);
      closeModal();
    });
  }, [socket]);

  function onClickJoin(e) {
    e.preventDefault();

    socket.emit("join_room", room);
    console.log("Room name is: ", room);
  }

  function openModal() {
    roomModal.current.showModal();
  };

  function closeModal() {
    roomModal.current.close();
  };

  return (
  <>
    <div className='w-full min-h-screen bg-image font-roboto'>
      <dialog className='rounded backdrop:bg-black backdrop:opacity-60' ref={roomModal}>
        <div className="flex flex-col items-center justify-center p-4 border border-black rounded w-80">
          <form onSubmit={onClickJoin}>
            <label htmlFor='roomName' className='text-lg'>Enter a room name:</label>
            <input className='p-2 text-lg leading-none border border-black rounded-md' required pattern="[A-Za-z0-9]{1,20}" name='roomName' disabled={isConnected} placeholder='Room Name' onChange={(e) => setRoom(e.target.value)}/>
            <button className="p-2 m-1 text-lg leading-none border border-black rounded-md" disabled={isConnected}>{isConnected ? "Connecting..." : "Join"}</button>
          </form>
        </div>
      </dialog>
      <Navbar />
      <MainGameContainer 
        room={room}
      />
      <Footer />  
    </div>
  </>
  )
}
