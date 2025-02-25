import { useState } from "react";
import useSocketStore from "../store/socketStore";
import useChessStore from "../store/chessStore";
import ChessBoard from "../components/chess/Chessboard.jsx";

const MultiplayerGame = () => {
  const [roomInput, setRoomInput] = useState("");
  const { joinGame, isGameStarted, startGameListener } = useSocketStore();
  const { listenForMoves } = useChessStore();

  const handleJoinGame = () => {
    if (roomInput.trim() !== "") {
      joinGame(roomInput);
      startGameListener();
      listenForMoves();
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white ">
      {!isGameStarted ? (
        <div>
          <h1 className="text-3xl font-bold mb-4">Multiplayer Chess</h1>
          <input
            type="text"
            placeholder="Enter Room ID"
            className="p-2 text-black"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
          />
          <button onClick={handleJoinGame} className="bg-blue-600 px-4 py-2 rounded ml-2">
            Join Game
          </button>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold mb-4">Game Started</h1>
          <ChessBoard />
        </div>
      )}
    </div>
  );
};

export default MultiplayerGame;
