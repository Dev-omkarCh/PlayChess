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

export default function ChessGamePage() {

  const { joinGame, isGameStarted, startGameListener } = useSocketStore();
  const { listenForMoves, promotion } = useChessStore();
  const { socket } = useMainSocket()
  const { gameId } = useFriendStore();
  const { gameOver, openGameOverModal } = useChessStore();
  const { room } = useSocketStore();
  const {setGameResult} = useResultStore();
  const { getBothPlayersDetails } = useFriend();

  // startGameListener();
  
  useEffect(()=>{
    if(socket) {
      getBothPlayersDetails();
    }
  },[]);
  
  listenForMoves();
  
  const handleResign = () => {
    setGameResult("lose","resign");
    openGameOverModal(true);
    socket.emit("resign",room);
  }

  const handleDraw = () => {
     socket.emit("drawRequest",room);
  }

  return (
    <>
      {gameOver && <ResultModel /> }
      <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <div className="md:hidden bg-gray-800 p-4 flex justify-between items-center">
        <HiMenu size={24} />
        <div className="text-2xl flex items-center gap-2">
          <FaChess /> Chess.com
        </div>
        <div className="flex gap-4">
          <MdOutlineSettings size={24} />
          <IoChatbubbleOutline size={24} />
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1">

        <div className="flex-1 flex flex-col items-center justify-center p-2">
          <div className="aspect-square w-full sm:w-[400px] md:w-[500px] lg:w-[600px] max-w-[700px]">
          {promotion && <PromotionModal />}
            <ChessBoard />
          </div>
        </div>

        <div className="w-full md:w-1/4 bg-gray-800 p-4 flex flex-col gap-4 md:h-screen">
          <div className='flex h-[100%] flex-col'>
            <MoveHistory />
            <div className=" flex justify-center items-center gap-4 mt-4 flex-col">
              <div className='flex gap-3'>
                <button className="p-2 bg-gray-700 rounded hover:bg-gray-600 h-fit" onClick={handleDraw}>Draw</button>
                <button className="p-2 bg-gray-700 rounded hover:bg-gray-600 h-fit" onClick={handleResign}>Resign</button>
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

// import { useState } from "react";
// import useSocketStore from "../store/socketStore";
// import useChessStore from "../store/chessStore";
// import ChessBoard from "../components/chess/Chessboard.jsx";

// const MultiplayerGame = () => {
//   const [roomInput, setRoomInput] = useState("");
//   const { joinGame, isGameStarted, startGameListener } = useSocketStore();
//   const { listenForMoves } = useChessStore();

//   const handleJoinGame = () => {
//     if (roomInput.trim() !== "") {
//       joinGame(roomInput);
//       startGameListener();
//       listenForMoves();
//     }
//   };

//   return (
//     <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white ">
//       {!isGameStarted ? (
//         <div>
//           <h1 className="text-3xl font-bold mb-4">Multiplayer Chess</h1>
//           <input
//             type="text"
//             placeholder="Enter Room ID"
//             className="p-2 text-black"
//             value={roomInput}
//             onChange={(e) => setRoomInput(e.target.value)}
//           />
//           <button onClick={handleJoinGame} className="bg-blue-600 px-4 py-2 rounded ml-2">
//             Join Game
//           </button>
//         </div>
//       ) : (
//         <div>
//           <h1 className="text-3xl font-bold mb-4">Game Started</h1>
//           <ChessBoard />
//         </div>
//       )}
//     </div>
//   );
// };

// export default MultiplayerGame;

