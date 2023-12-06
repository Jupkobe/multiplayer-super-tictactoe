import { useEffect, useState } from 'react';
import { socket } from "./socket";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dialog from './components/Dialog';
import MainGameContainer from './components/MainGameContainer';
import Confetti from './components/Confetti';

export default function App() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [winner, setWinner] = useState(null);
  
  useEffect(() => {
    socket.on("username-selected", (usernameFromServer) => {
      console.log("username-selected", usernameFromServer);
      setUsername(usernameFromServer);
    });

    socket.on("joined-room", ({ roomId }) => {
      setRoomId(roomId);
    });
    
    socket.on("game-over", winner => {
      setWinner(winner);
    });

    socket.on("reset", () => {
      setWinner(null);
    });

    () => {
      socket.off("username-selected");
      socket.off("joined-room");
      socket.off("game-over");
      socket.off("reset");
      socket.disconnect();
    }
  }, [socket]);
  
  return (
  <>
    <div className='w-full min-h-screen bg-image font-montserrat'>
      {winner && <Confetti />}
      <Navbar />
      <Dialog
        roomId={roomId}
        username={username}
        winner={winner}
      />
      <MainGameContainer 
        roomId={roomId}
        username={username}
      />
      <Footer />  
    </div>
  </>
  )
}
