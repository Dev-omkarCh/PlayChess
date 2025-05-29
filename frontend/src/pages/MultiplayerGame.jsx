import { FaChess } from 'react-icons/fa';
import { IoChatbubbleOutline } from 'react-icons/io5';
import { MdOutlineSettings } from 'react-icons/md';
import { HiMenu } from 'react-icons/hi';
import ChessBoard from '../components/chess/ChessBoard';
import { useEffect, useState } from 'react';
import useSocketStore from '../store/socketStore';
import useChessStore from '../store/chessStore';
import PromotionModal from '../components/chess/PromotionModal';
import useFriendStore from '../store/useFriendStore';
import useSocket from '../hooks/useSocket';
import { useMainSocket } from '../store/socketIoStore';
import MoveHistory from '../components/chess/MoveHistory';
import ResultModel from '../components/chess/ResultModel';
import DrawRequestModal from '../components/chess/DrawRequestModal';
import { useResultStore } from '../store/resultStore';
import { useFriend } from '../hooks/useFriend';
import PlayerProfile from '../components/chess/PlayerProfile';
import Button from '../components/Button';
import useSettingStore from '../store/settingStore';
import toast from 'react-hot-toast';

export default function ChessGamePage() {

  const { joinGame, isGameStarted, startGameListener, playerColor, setPlayerColor } = useSocketStore();
  const { listenForMoves, promotion } = useChessStore();
  const { gameStatus } = useFriendStore();
  const { gameId } = useFriendStore();
  const { gameOver, openGameOverModal, changeGameState, setGameState } = useChessStore();
  const { room } = useSocketStore();
  const {setGameResult, you, opponent} = useResultStore();
  const { getBothPlayersDetails, checkIfGameIsReloaded } = useFriend();
  const { getSettings } = useSettingStore();
  const [isLoading, setIsLoading] = useState(false);

  //TODO : changed
  const { socket } = useMainSocket();

  useEffect(()=>{

    const handleBeforeUnload = async () => {
      const gameState = useChessStore.getState();
      const roomId = room;

      console.log("roomId : ",roomId,playerColor);
  
      if (!roomId || !gameState.board.length) return toast.error("No room Id");

      // ✅ Save flags in localStorage
      localStorage.setItem("isRestoringGame", "true");
  
      // Save game status to DB before refresh
      await fetch("/api/users/game/save-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          roomId,
          board: gameState.board,
          turn: gameState.turn,
          notations: gameState.notation,
          playerColor,
          white: playerColor === "white" ? you?._id : opponent?._id,
          black: playerColor === "black" ? you?._id : opponent?._id,
        }),
      });
  
    };

    getSettings();
    window.addEventListener("beforeunload", handleBeforeUnload);
    // document.addEventListener("visibilitychange", () => {
    //   if (document.visibilityState === "hidden") {
    //     handleBeforeUnload();
    //   }
    // });
    if(socket){
      console.log(socket);
  }
  else{
      console.log(socket)
  }
     
    if(socket) {
      getBothPlayersDetails();
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // document.removeEventListener("visibilitychange", handleUnload);
    }
  },[]);

  useEffect(() => {
    const roomId = localStorage.getItem("roomId");
    const playerColor = localStorage.getItem("playerColor");
    const isRestoringGame = localStorage.getItem("isRestoringGame") === "true";

    if (!roomId || !isRestoringGame || !playerColor) return;

    setIsLoading(true);

    setTimeout(async() => {
      try{
        const response = await fetch(`/api/users/game/load-status/${roomId}`,{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            playerColor
          }),
          keepalive: true
        });
        const data = await response.json();

        if(response.ok){
            setGameState(data);
            localStorage.removeItem("isRestoringGame");

            setPlayerColor(data?.playerColor);
            socket?.emit("joinGameAgain",roomId);
            
            setIsLoading(false);
        }
      }
      catch(e){
          console.error("Restore failed", e);
          setIsLoading(false);
      }

        // .then((res) => res.json())
        // .then((data) => {
        //   setGameState(data);
        //   setIsLoading(false);
        //   localStorage.removeItem("hasSavedGame");
        //   localStorage.removeItem("isRestoringGame");
        // })
        // .catch((err) => {
        //   console.error("Restore failed", err);
        //   setIsLoading(false);
        // });
    }, 600); // small buffer to let DB complete save
  }, []);
  
  listenForMoves();
  
  const handleResign = () => {
    console.log("before");
    setGameResult("lose","resign");
    console.log("after");
    openGameOverModal(true);
    socket.emit("resign",room);
  }

  const handleDraw = () => {
     socket.emit("drawRequest",room);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white text-xl">
        ♟️ Restoring your game... Please wait...
      </div>
    );
  }

  return (
    <>
      {gameOver && <ResultModel /> }
      <div className="min-h-screen flex flex-col bg-primary text-white">
      <div className="flex flex-col md:flex-row flex-1">

        <div className="w-full flex flex-col items-center justify-start p-2 relative bg-primary border-r border-sectionBorder">
          <div className='player-section w-full h-[10%] flex justify-start items-center'>
            <PlayerProfile username={opponent?.username} elo={opponent?.elo} img={opponent?.profileImg} />
          </div>
          <div className="aspect-square w-full sm:w-[400px] md:w-[500px] lg:w-[500px] max-w-[700px] flex-grow">
          {promotion && <PromotionModal />}
            <ChessBoard />
          </div>
          <div className='player-section w-full h-[10%] flex justify-end items-center'>
            <PlayerProfile username={you?.username} elo={you?.elo} you={true} img={you?.profileImg} />
          </div>
        </div>

        <div className="w-full md:w-1/4 bg-secondary flex-grow p-4 flex flex-col gap-4 md:h-screen">
          <div className='flex h-[100%] flex-col flex-grow'>
            <MoveHistory />
            <div className=" flex justify-center items-center gap-4 mt-4 flex-col mb-3">
              <div className='flex w-full items-center gap-3 justify-evenly'>
                <Button text={"Draw"} handleOnClick={handleDraw} color='purple'  />
                <Button text={"Resign"} handleOnClick={handleResign} color='red' />
              </div>
              <DrawRequestModal />
            </div>
          </div>
          
        </div>
      </div>
    </div>
    </>
  );
}

