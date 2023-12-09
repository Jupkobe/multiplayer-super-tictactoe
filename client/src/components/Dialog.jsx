import { useEffect, useState, useMemo, useRef } from 'react';
import { socket } from "../socket";
import { useLocation, useNavigate } from "react-router-dom";
import UsernameModal from './modals/UsernameModal';
import NewGameModal from './modals/NewGameModal';
import WinnerModal from './modals/WinnerModal';
import InviteModal from './modals/InviteModal';

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Dialog({ winner }) {
  const [showUsernameModal, setShowUsernameModal] = useState(true);
  const [showNewGameModal, setShowNewGameModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const navigateTo = useNavigate();
  let query = useQuery();  
  const modal = useRef(null);

  useEffect(() => {
    socket.on("connect", () => {
      modal.current.showModal();
    })
    
    socket.on("username-selected", (usernameFromServer) => {
      socket.username = usernameFromServer;
      setShowUsernameModal(false);
      setIsConnecting(false);
      setShowNewGameModal(true);

      if (query.get("roomId")) {
        socket.emit("join-room", query.get("roomId"));
        navigateTo("/");
      }
    });

    socket.on("joined-room", ({ roomId }) => {
      socket.roomId = roomId;
      
      setIsConnecting(false);
      setShowInviteModal(true);
    });

    socket.on("invite-friend", () => {
      setShowNewGameModal(false);
      setShowInviteModal(true);
    });

    socket.on("game-ready", () => {
      modal.current.close();
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
      modal.current.showModal();
    });    

    // ERROR HANDLING
    socket.on("error", (errorMsg) => {
      showAlert(errorMsg);
      setIsConnecting(false);
    });

    () => {
      socket.off("joined-room");
      socket.off("username-selected");
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
      <dialog onKeyDown={(e) => {if (e.key === 'Escape') e.preventDefault()}} className='rounded backdrop:bg-black backdrop:opacity-60' ref={modal}>
        {showUsernameModal && <UsernameModal 
          onUsernameSelect={onUsernameSelect}
          error={error}
          isConnecting={isConnecting}
        />}
        {showNewGameModal && <NewGameModal
          error={error}
          isConnecting={isConnecting}
          onClickJoin={onClickJoin}
          onClickNewGame={onClickNewGame}
        />}
        {showInviteModal && <InviteModal/>}
        {showWinnerModal && <WinnerModal 
          winner={winner}
        />}
      </dialog>
    </>
  )
}