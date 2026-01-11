import { useDrop } from "react-dnd";
import useChessStore from "../store/chessStore.js"
import ChessPiece from "../components/chess/ChessPiece.jsx";
import { fileLetters } from "../utils/chesshelper.js";
import useSettingStore from "../store/settingStore.js";
import useSocketStore, { useRoom } from "../hooks/useRoom.js";
import { useState } from "react";


const ChessBoard = () => {

  const { board, movePiece, selectPiece, suggestedMoves, movePieceByClick } = useChessStore();
  const { boardColor } = useSettingStore();
  const { playerColor } = useSocketStore();
  const boardToRender = playerColor === "black" ? [...board].reverse() : board;
  // const [isRed, setIsRed] = useState(false);


  return (
    <div className="w-full h-full shadow-lg grid grid-cols-8 grid-rows-8 border border-[#333]">
      {boardToRender?.map((row, rowIndex) =>
        row?.map((square, colIndex) => {

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

          const sqaureInSuggestion = suggestedMoves.filter(move =>{
            if(move?.row === rowIndex && move?.col === colIndex){
              return move;
            }
          });
          const isSuggestedSquare = sqaureInSuggestion?.length > 0
          const detectCapture = square?.type && isSuggestedSquare ? true : false;

          const isAbleToCapture = detectCapture ? true : false;

          return (
          
            <div
              key={squareName + fileLetters[rowIndex]}
              ref={drop}
              onClick={() => {
                selectPiece(adjustedRowIndex,colIndex);
                movePieceByClick(adjustedRowIndex, colIndex)
              }}             
              
              className={`max-w-18 max-h-18 flex items-center justify-center relative
                ${squareName} 
                ${isSuggestedSquare ?  "bg-yellow-500" : ""}
                ${isOver ? "bg-yellow-500" : ""}
                
              `}
              style={{
                backgroundColor: `${(adjustedRowIndex + colIndex) % 2 === 0 ? `${boardColor?.whiteTile}` : `${boardColor?.blackTile}`}`
              }}
            >
              {square && <ChessPiece piece={square} position={{ row: adjustedRowIndex, col: colIndex }} />}
              {/* {squareName} */}
              {isSuggestedSquare ? <span className="h-5 w-5 rounded-full bg-[#816c4a42] absolute z-50"></span> : ""}
            </div>
            
          );
        })
      )}
    </div>
  );
};

export default ChessBoard;