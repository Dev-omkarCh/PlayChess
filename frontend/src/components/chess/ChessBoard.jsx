import { useEffect, useRef } from "react";
import { useDrop } from "react-dnd";

import useChessStore from "../../store/chessStore.js";
import useSocketStore from "../../store/socketStore";
import moveSound from "../../sounds/move.mp3";
import ChessPiece from "./ChessPiece";
import { fileLetters } from "../../utils/chesshelper.js";
import PromotionModal from "./PromotionModal.jsx";
import useSettingStore from "../../store/settingStore.js";


const ChessBoard = () => {
  const { board, movePiece, selectPiece, suggestedMoves, selectedPiece, setSelectedPiece, setSuggestedMoves, turn } = useChessStore();
  const { playerColor } = useSocketStore();
  const { promotion } = useChessStore();
  const { boardColor, getSettings } = useSettingStore();

  // Adjust board orientation for black player
  const boardToRender = playerColor === "black" ? [...board].reverse() : board;

  return (
    <div className="w-full h-full shadow-lg grid grid-cols-8 grid-rows-8 border border-[#333]">
      {boardToRender.map((row, rowIndex) =>
        row.map((square, colIndex) => {
          // Flip row index if player is black
          const adjustedRowIndex = playerColor === "black" ? 7 - rowIndex : rowIndex;

          // Get chess square name (e2, b8, etc.)
          const squareName = `${fileLetters[colIndex]}${8 - adjustedRowIndex}`;

          // Enable drag-and-drop
          const [{ isOver }, drop, ] = useDrop(() => ({
            accept: "piece",
            drop: (item) => movePiece(item.position.row, item.position.col, adjustedRowIndex, colIndex),
            collect: (monitor) => ({
              isOver: !!monitor.isOver(),
            }),
          }));

          let sqaureInSuggestion = [];
          if (suggestedMoves.length > 0) {
            sqaureInSuggestion = suggestedMoves?.filter((cell) => {
              if (cell.row === rowIndex && cell.col === colIndex) return cell
            });
          };

          const isSuggestedSquare = sqaureInSuggestion.length > 0 ? true : false;
          const detectCapture = square?.type && isSuggestedSquare ? true : false;

          const isAbleToCapture = detectCapture ? true : false;

          return (
          
            <div
              key={squareName}
              ref={drop}
              onClick={() => {
                selectPiece(adjustedRowIndex,colIndex);
              }}
              className={`max-w-18 max-h-18 flex items-center justify-center relative
                ${squareName} 
                ${isOver ? "bg-yellow-500" : ""}
                ${isAbleToCapture ? "bg-red-500" : ""}
              `}
              style={{
                backgroundColor: `${(adjustedRowIndex + colIndex) % 2 === 0 ? `${boardColor?.whiteTile}` : `${boardColor?.blackTile}`}`
                  
              }}
            >
              {square && <ChessPiece piece={square} position={{ row: adjustedRowIndex, col: colIndex }} />}
              {isSuggestedSquare && !isAbleToCapture ? <span className="h-5 w-5 rounded-full bg-[#816c4a42] absolute z-50"></span> : ""}
            </div>
            
          );
        })
      )}
    </div>
  );
};

export default ChessBoard;