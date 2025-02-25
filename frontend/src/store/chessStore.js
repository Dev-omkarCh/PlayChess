
import { create } from "zustand";
import { isValidMove, getPossibleMoves } from "../utils/chessLogic";
import useSocketStore from "./socketStore";
import { toast } from "react-hot-toast";
import { isKingInCheck, isCheckmate } from "../utils/chessLogic";

const initialBoard = () => {
  const emptyBoard = Array(8).fill(null).map(() => Array(8).fill(null));

  const pieces = {
    R: "rook", N: "knight", B: "bishop", Q: "queen", K: "king", P: "pawn"
  };

  // Place pieces manually
  const setupRow = (row, isWhite) => {
    emptyBoard[row] = [
      { type: pieces.R, color: isWhite ? "white" : "black" },
      { type: pieces.N, color: isWhite ? "white" : "black" },
      { type: pieces.B, color: isWhite ? "white" : "black" },
      { type: pieces.Q, color: isWhite ? "white" : "black" },
      { type: pieces.K, color: isWhite ? "white" : "black" },
      { type: pieces.B, color: isWhite ? "white" : "black" },
      { type: pieces.N, color: isWhite ? "white" : "black" },
      { type: pieces.R, color: isWhite ? "white" : "black" },
    ];
  };

  setupRow(0, false);
  setupRow(7, true);

  // Add pawns
  emptyBoard[1] = Array(8).fill({ type: pieces.P, color: "black" });
  emptyBoard[6] = Array(8).fill({ type: pieces.P, color: "white" });

  return emptyBoard;
};

const useChessStore = create((set, get) => ({
  board: initialBoard(),
  turn: "white",
  selectedPiece: null,
  suggestedMoves: [], // Stores highlighted squares

  // Select a piece and calculate possible moves
  selectPiece: (row, col) => set((state) => {
    const piece = state.board[row][col];

    if (!piece || piece.color !== state.turn) {
      toast.error("Not your turn!");
      return state;
    }

    const possibleMoves = getPossibleMoves(piece, row, col, state.board);
    
    return { selectedPiece: { row, col }, suggestedMoves: possibleMoves };
  }),

  movePiece: (fromRow, fromCol, toRow, toCol, audioRef) => set((state) => {
    const { board, turn } = state;
    const { socket, room } = useSocketStore.getState();

    const piece = board[fromRow][fromCol];
    if (!piece || piece.color !== turn) {
      toast.error("Invalid move: Not your turn!");
      return state;
    }

    if (!isValidMove(piece, fromRow, fromCol, toRow, toCol, board)) {
      toast.error("Invalid move!");
      return state;
    }

    // Move the piece
    const newBoard = board.map((r) => [...r]);
    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = null;

    // Check if the opponent's king is in check
    const opponentColor = turn === "white" ? "black" : "white";
    if (isKingInCheck(newBoard, opponentColor)) {
      toast.error(`${opponentColor.charAt(0).toUpperCase() + opponentColor.slice(1)} is in Check!`);
    }

    // Check for Checkmate
    if (isCheckmate(newBoard, opponentColor)) {
      toast.success(`Checkmate! ${turn} wins!`);
      return { board: initialBoard(), turn: "white", selectedPiece: null, suggestedMoves: [] }; // Reset board after game ends
    }

    // Emit move to the server
    if (room) {
      socket.emit("movePiece", { room, move: { from: { row: fromRow, col: fromCol }, to: { row: toRow, col: toCol }, piece } });
    }

    audioRef.current.currentTime = 0;
    audioRef.current.play();

    return { board: newBoard, turn: opponentColor, selectedPiece: null, suggestedMoves: [] };
  }),

  // 1
  // movePiece: (fromRow, fromCol, toRow, toCol, audioRef) => set((state) => {
  //   const { board, turn } = state;
  //   const { socket, room } = useSocketStore.getState();

  //   const piece = board[fromRow][fromCol];
  //   if (!piece || piece.color !== turn) {
  //     toast.error("Invalid move: Not your turn!");
  //     return state;
  //   }

  //   if (!isValidMove(piece, fromRow, fromCol, toRow, toCol, board)) {
  //     toast.error("Invalid move!");
  //     return state;
  //   }

  //   // Update board locally
  //   const newBoard = board.map((r) => [...r]);
  //   newBoard[toRow][toCol] = piece;
  //   newBoard[fromRow][fromCol] = null;

  //   // Emit move to the server
  //   if (room) {
  //     console.log("Emitting move:", { fromRow, fromCol, toRow, toCol, piece });
  //     socket.emit("movePiece", { room, move: { from: { row: fromRow, col: fromCol }, to: { row: toRow, col: toCol }, piece } });
  //   }

  //   audioRef.current.currentTime = 0;
  //   audioRef.current.play();

  //   return { board: newBoard, turn: turn === "white" ? "black" : "white", selectedPiece: null, suggestedMoves: [] };
  // }),

  listenForMoves: () => {
    const { socket } = useSocketStore.getState();
    socket.on("updateBoard", ({ from, to, piece }) => {
      set((state) => {
        const newBoard = state.board.map((r) => [...r]);
        newBoard[to.row][to.col] = piece;
        newBoard[from.row][from.col] = null;
        return { board: newBoard, turn: state.turn === "white" ? "black" : "white", suggestedMoves: [] };
      });
    });
  },
}));

export default useChessStore;
