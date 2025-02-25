import useChessStore from "../../store/chessStore.js";
import useSocketStore from "../../store/socketStore";
import ChessPiece from "./ChessPiece";
import { useDrop } from "react-dnd";

import moveSound from "../../sounds/move.mp3";
import { useEffect, useRef } from "react";

const ChessBoard = () => {
  const { board, movePiece } = useChessStore();
  const { playerColor } = useSocketStore();

  // sound effect for moving pieces
  const audioRef = useRef(new Audio(moveSound));
  useEffect(() => {
    audioRef.current.preload = 'auto';
  }, []);

  // Chessboard File Letters
  const fileLetters = ["a", "b", "c", "d", "e", "f", "g", "h"];

  // Adjust board orientation for black player
  const boardToRender = playerColor === "black" ? [...board].reverse() : board;

  return (
    <div className="grid grid-cols-8">
      {boardToRender.map((row, rowIndex) =>
        row.map((square, colIndex) => {
          // Flip row index if player is black
          const adjustedRowIndex = playerColor === "black" ? 7 - rowIndex : rowIndex;

          // Get chess square name (e2, b8, etc.)
          const squareName = `${fileLetters[colIndex]}${8 - adjustedRowIndex}`;

          // Enable drag-and-drop
          const [{ isOver }, drop] = useDrop(() => ({
            accept: "piece",
            drop: (item) => movePiece(item.position.row, item.position.col, adjustedRowIndex, colIndex, audioRef),
            collect: (monitor) => ({
              isOver: !!monitor.isOver(),
            }),
          }));

          return (
            <div
              key={squareName}
              ref={drop}
              className={`w-12 h-12 flex items-center justify-center 
                ${squareName} 
                ${(adjustedRowIndex + colIndex) % 2 === 0 ? "bg-[#edd6b0]" : "bg-[#b88762]"} 
                ${isOver ? "bg-yellow-400" : ""}`}
            >
              {square && <ChessPiece piece={square} position={{ row: adjustedRowIndex, col: colIndex }} />}
            </div>
          );
        })
      )}
    </div>
  );
};

export default ChessBoard;

// import useChessStore from "../../store/chessStore.js";
// import useSocketStore from "../../store/socketStore";
// import ChessPiece from "./ChessPiece";
// import { useDrop } from "react-dnd";

// import moveSound from "../../sounds/move.mp3";
// import { useEffect, useRef } from "react";

// const ChessBoard = () => {
//   const { board, selectPiece, movePiece, selectedPiece, suggestedMoves } = useChessStore();
//   const { playerColor } = useSocketStore();

//   // sound effect for moving pieces
//   const audioRef = useRef(new Audio(moveSound));
//   useEffect(() => {
//     audioRef.current.preload = 'auto';
//   }, []);

//   // Chessboard File Letters
//   const fileLetters = ["a", "b", "c", "d", "e", "f", "g", "h"];

//   // Adjust board orientation for black player
//   const boardToRender = playerColor === "black" ? [...board].reverse() : board;

//   return (
//     <div className="grid grid-cols-8 w-96 border">
//       {boardToRender.map((row, rowIndex) =>
//         row.map((square, colIndex) => {
//           // Flip row index if player is black
//           const adjustedRowIndex = playerColor === "black" ? 7 - rowIndex : rowIndex;

//           // Get chess square name (e2, b8, etc.)
//           const squareName = `${fileLetters[colIndex]}${8 - adjustedRowIndex}`;

//           // Check if this square is a suggested move
//           const isSuggestedMove = suggestedMoves.some(
//             (move) => move.row === adjustedRowIndex && move.col === colIndex
//           );

//           // Enable drag-and-drop
//           const [{ isOver }, drop] = useDrop(() => ({
//             accept: "piece",
//             drop: (item) => movePiece(item.position.row, item.position.col, adjustedRowIndex, colIndex, audioRef),
//             collect: (monitor) => ({
//               isOver: !!monitor.isOver(),
//             }),
//           }));

//           return (
//             <div
//               key={squareName}
//               ref={drop}
//               onClick={() => selectPiece(adjustedRowIndex, colIndex)}
//               className={`w-12 h-12 flex items-center justify-center 
//                 ${squareName} 
//                 ${(adjustedRowIndex + colIndex) % 2 === 0 ? "bg-gray-300" : "bg-gray-700"} 
//                 ${isOver ? "bg-yellow-400" : ""}
//                 ${isSuggestedMove ? "bg-green-500 opacity-50" : ""}`} // Green for suggested moves
//             >
//               {square && <ChessPiece piece={square} position={{ row: adjustedRowIndex, col: colIndex }} />}
//             </div>
//           );
//         })
//       )}
//     </div>
//   );
// };

// export default ChessBoard;
