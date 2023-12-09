import { useEffect, useState } from 'react';
import { socket } from "./socket";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dialog from './components/Dialog';
import MainGameContainer from './components/MainGameContainer';
import Confetti from './components/Confetti';

export default function App() {
  const [winner, setWinner] = useState(null);

  useEffect(() => {    
    socket.on("game-over", winner => {
      setWinner(winner);
    });

    socket.on("reset", () => {
      setWinner(null);
    });

    () => {
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
        winner={winner}
      />
      <MainGameContainer/>
      <Footer />  
    </div>
  </>
  )
}
