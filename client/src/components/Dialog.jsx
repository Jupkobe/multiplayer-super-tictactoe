import { useEffect, useState, useMemo } from 'react';
import { socket } from "../socket";
import { useLocation } from "react-router-dom";
import UsernameModal from './modals/UsernameModal';
import NewGameModal from './modals/NewGameModal';
import WinnerModal from './modals/WinnerModal';
import InviteModal from './modals/InviteModal';

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Dialog({ roomId, username, setUsername, winner }) {
  const [showUsernameModal, setShowUsernameModal] = useState(true);
  const [showNewGameModal, setShowNewGameModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  let query = useQuery();

  useEffect(() => {
    socket.on("welcome", () => {
      setShowUsernameModal(true);
      setShowInviteModal(false);
      setShowNewGameModal(false);
      setShowWinnerModal(false);
    })

    socket.on("invite-friend", () => {
      setShowNewGameModal(false);
      setIsConnecting(false);
      setShowInviteModal(true);
    });

    socket.on("game-ready", () => {
      setIsConnecting(false);
      setShowInviteModal(false);
      setShowNewGameModal(false);
      setShowUsernameModal(false);
      setShowWinnerModal(false);
    });

    socket.on("game-over", () => {
      setShowInviteModal(false);
      setShowNewGameModal(false);
      setShowUsernameModal(false);
      setShowWinnerModal(true);
    });    

    // ERROR HANDLING
    socket.on("error", (errorMsg) => {
      showAlert(errorMsg);
      setIsConnecting(false);
    });

    () => {
      socket.off("welcome");
      socket.off("invite-friend");
      socket.off("game-ready");
      socket.off("game-over");
      socket.off("error");
      socket.disconnect();
    }
  }, [socket]);
  
  function onUsernameSelect(inputUsername) {
    setUsername(inputUsername);
    
    if (query.get("roomId")?.length === 5) socket.emit("join-with-url", query.get("roomId"), inputUsername);
    setShowUsernameModal(false);
    setShowNewGameModal(true);
  }

  function onClickJoin(inputRoomId) {    
    setIsConnecting(true);
    socket.emit("join-room", inputRoomId, username);
  }

  function onClickNewGame(selection) {
    setIsConnecting(true);
    socket.emit("create-room", selection, username);
  }

  function showAlert(errorMsg) {
    setError(errorMsg);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  return (
    <>
      <UsernameModal 
        onUsernameSelect={onUsernameSelect}
        isConnecting={isConnecting}
        isOpen={showUsernameModal}
      />
      <NewGameModal
        error={error}
        isConnecting={isConnecting}
        onClickJoin={onClickJoin}
        onClickNewGame={onClickNewGame}
        isOpen={showNewGameModal}
      />
      <InviteModal 
        roomId={roomId}
        isOpen={showInviteModal}
      />
      <WinnerModal 
        winner={winner}
        roomId={roomId}
        username={username}
        isOpen={showWinnerModal}
      />
    </>
  )
}