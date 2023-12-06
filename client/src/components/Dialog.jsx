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

export default function Dialog({ roomId, username, winner }) {
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
    });

    socket.on("username-selected", () => {
      setShowUsernameModal(false);
      setIsConnecting(false);

      if (query.get("roomId")) {
        socket.emit("join-room", query.get("roomId"));
      }
      setShowNewGameModal(true);
    });

    socket.on("joined-room", () => {
      setIsConnecting(false);
    });

    socket.on("invite-friend", () => {
      setShowNewGameModal(false);
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
      socket.off("joined-room");
      socket.off("invite-friend");
      socket.off("game-ready");
      socket.off("game-over");
      socket.off("error");
      socket.disconnect();
    }
  }, [socket]);
  
  function onUsernameSelect(inputUsername) {
    socket.emit("username-selection", inputUsername);
    setIsConnecting(true);
  }

  function onClickJoin(inputRoomId) {
    setIsConnecting(true);
    socket.emit("join-room", inputRoomId);
  }

  function onClickNewGame(selection) {
    setIsConnecting(true);
    socket.emit("create-room", selection);
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
        error={error}
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