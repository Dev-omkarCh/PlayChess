import { useEffect } from 'react';
import useChessStore from '../store/chessStore';
import useSettingStore from '../store/settingStore';

import LeftBoardSection from '@/components/MutiplayerGame/LeftBoardSection';
import RightMovesSection from '@/components/MutiplayerGame/RightMovesSection';
import ResultModel from '../test/ResultModel';
import useSocketStore from '../store/socketStore';
import { FaChessBishop, FaChessKnight, FaChessQueen, FaChessRook } from 'react-icons/fa6';
import { useSocketContext } from '@/context/SocketContext';

const MutiplayerGame = () => {

  const { listenForMoves, gameOver, promotionSquare, promote, board, turn, gameHistory } = useChessStore();
  const { playerColor, room } = useSocketStore();
  const { getSettings } = useSettingStore();
  const socket = useSocketContext();


  useEffect(() => {
    if (socket) {

      if (localStorage.getItem("board")) {
        console.log(`When board Exists`);

        const board = JSON.parse(localStorage.getItem("board"));
        const turn = localStorage.getItem("turn");
        const roomId = localStorage.getItem("roomId");
        const playerColor = localStorage.getItem("playerColor");
        const restoredGameHistory = JSON.parse(localStorage.getItem("gameHistory"));
        console.log(restoredGameHistory);

        console.log("Restored board state", board);

        useChessStore.setState({ board, turn });
        useSocketStore.setState({ playerColor, room: roomId });
        useSocketStore.setState({ playerColor, room: roomId });

        socket?.emit("joinGameOnReload", roomId);
        getSettings();
        return;
      }

      localStorage.setItem("board", JSON.stringify(board));
      localStorage.setItem("turn", turn);
      localStorage.setItem("roomId", room);
      localStorage.setItem("playerColor", playerColor);
      localStorage.getItem("gameHistory", gameHistory);

      getSettings();
    }

  }, [socket]);

  listenForMoves();

  const pieceOptions = [
    { type: "queen", icon: <FaChessQueen /> },
    { type: "rook", icon: <FaChessRook /> },
    { type: "bishop", icon: <FaChessBishop /> },
    { type: "knight", icon: <FaChessKnight /> }
  ]

  return (
    <>
      {gameOver && <ResultModel />}
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
        {/* <GameChatDialog /> */}
        <div className="flex flex-col md:flex-row flex-1">
          <LeftBoardSection />
          <RightMovesSection />
        </div>
      </div>
    </>
  );
};

export default MutiplayerGame;