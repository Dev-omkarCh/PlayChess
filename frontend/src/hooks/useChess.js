import useChessStore from "../store/chessStore";
import { useMainSocket } from "../store/socketIoStore";

export const useChess = () => {
   const { socket } = useMainSocket();
   const { board } = useChessStore();
   const {state} = useChessStore();
   const listenForMoves = () => {

       socket.on("updateBoard", ({ from, to, piece }) => {
           const newBoard = board.map((r) => [...r]);
           newBoard[to.row][to.col] = piece;
           newBoard[from.row][from.col] = null;
           return { board: newBoard, turn: state.turn === "white" ? "black" : "white", suggestedMoves: [] };
       });
     }

     return { listenForMoves }
};