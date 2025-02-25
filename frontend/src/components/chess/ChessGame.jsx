import ChessBoard from "./ChessBoard";
import useChessStore from "../../store/chessStore";

const ChessGame = () => {
  // const { turn, gameStatus } = useChessStore();
  const { turn } = useChessStore();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">Chess Multiplayer</h1>
      <p className="mb-2">Turn: {turn.toUpperCase()}</p>
      <ChessBoard />
    </div>
  );
};

export default ChessGame;
