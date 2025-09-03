import { useEffect } from 'react';
import useChessStore from '../store/chessStore';
import { useMainSocket } from '../store/socketIoStore';
import useSettingStore from '../store/settingStore';

import LeftBoardSection from '../pages/MutiplayerGame/LeftBoardSection';
import RightMovesSection from '../pages/MutiplayerGame/RightMovesSection';
import ResultModel from '../test/ResultModel';
import useSocketStore from '../store/socketStore';
import { useMatchmaking } from '../hooks/useMatchMaking';
import WaitingScreen from '../components/WaitingScreen';
import GameChatDialog from '@/components/ChatDailog';
import { FaChessBishop, FaChessKnight, FaChessQueen, FaChessRook } from 'react-icons/fa6';

export default function TestOnlineChess() {

  const { listenForMoves, gameOver, promotionSquare, promote, board, turn } = useChessStore();
  const { playerColor } = useSocketStore();
  const { getSettings } = useSettingStore();
  const { socket } = useMainSocket();

  const { joinQueue } = useMatchmaking();
  const { room } = useSocketStore();
  // const { authUser } = useAuth();
  // let getDataLoading = false;


  useEffect(() => {
    if (socket) {

      // check is reload count is more than 2, then we can get the game state from localStorage/database
      if(JSON.parse(localStorage.getItem("reload"))?.count >= 2){
        if(localStorage.getItem("state")){

          const state = JSON.parse(localStorage.getItem("state"));

          const board = state?.board;
          const turn = state?.turn;
          const roomId = state?.roomId;
          const playerColor = state?.playerColor;

          console.log("Restored board state", board);
          
          useChessStore.setState({ board, turn });
          useSocketStore.setState({ playerColor, room : roomId });

          socket?.emit("joinGameOnReload", roomId);

        }
      }
      
      localStorage.setItem("state", JSON.stringify({
        board,
        turn,
        roomId : room,
        playerColor,
      }));
      localStorage.setItem("gameExists",true);

      getSettings();
      joinQueue();
    }

    return () => {

      // check if reload happened before?
      if(localStorage.getItem("reload")){

        // if yes, then increase the count
        const reloadDetails = JSON.parse(localStorage.getItem("reload"));
        
        reloadDetails.count += 1;
        localStorage.setItem("reload", JSON.stringify(reloadDetails));
        
        // reloadDetails.user = authUser?._id;
        
      }
      // if not, then we know its the inital load
      else{
        localStorage.setItem("reload", JSON.stringify({ count : 1}));
      }
    }

  },[socket]);

  listenForMoves();

  if(!room && !localStorage.getItem("state")){
    return (
      <div className='min-h-screen w-full flex flex-col bg-primary text-white'>
        <WaitingScreen open  />
      </div>
    )
  };

  const pieceOptions = [
    { type: "queen", icon: <FaChessQueen /> },
    { type: "rook", icon: <FaChessRook /> },
    { type: "bishop", icon: <FaChessBishop /> },
    { type: "knight", icon: <FaChessKnight /> }
  ]

  return (
    <>
      { gameOver && <ResultModel /> }
      {promotionSquare && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-secondary p-4 rounded-lg shadow-lg z-50">
            <h2 className="text-lg font-bold mb-2">Promote Pawn To:</h2>
            <div className="flex gap-2">
              {pieceOptions.map((piece) => (
                <button
                  key={piece.type}
                  className="px-3 py-2 bg-primary text-white rounded hover:bg-blue-700"
                  onClick={() => promote(piece)}
                >
                  {piece.icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="min-h-screen flex flex-col bg-primary text-white">
          <GameChatDialog />
        <div className="flex flex-col md:flex-row flex-1">
            <LeftBoardSection />
            <RightMovesSection />
        </div>
      </div>
    </>
  );
}

