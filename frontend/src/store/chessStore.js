
import { create } from "zustand";
import { isValidMove, getPossibleMoves } from "../utils/chessLogic";
import useSocketStore from "./socketStore";
import { toast } from "react-hot-toast";
import { isKingInCheck, isCheckmate } from "../utils/chessLogic";
import { useMainSocket } from "./socketIoStore";
import { generateAlgebraicNotation } from "../utils/generateNotation";
import useAuth from "./useAuth";
import useFriendStore from "./useFriendStore";
import { useFriend } from "../hooks/useFriend";
import { useResultStore } from "./resultStore";
// const { saveGame } = useFriend();

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

  drawRequest: false,
  openDrawRequest: () => set({ drawRequest: true }),
  closeDrawRequest: () => set({ drawRequest: false }),

  board: initialBoard(),
  castlingRights: { whiteKing: true, blackKing: true, whiteRookLeft: true, whiteRookRight: true, blackRookLeft: true, blackRookRight: true },
  turn: "white",
  selectedPiece: null,
  suggestedMoves: [], // Stores highlighted squares

  setSelectedPiece : (selectedPiece) => set({ selectedPiece }),
  setSuggestedMoves : (suggestedMoves) => set({ suggestedMoves }),
  promotion : null,
  capturedPieces : { you: [], opponent: []},
  notation : { you: [], opponent: [] },
  setNotation : (notation) => set({ notation }),

  // Changes
  result : null,
  type : null,
  openDummyModal: (result, type) => set({ result : result, type : type}),

  // end

  gameOver: null, // "win", "lose", "resign"
  openGameOverModal: (result) => set({ gameOver: result }),
  closeGameOverModal: () => set({ gameOver: null }),

  openPromotionModal: (row, col) => {
    set(()=>({
      promotion: { row, col }, // Force new object reference
    }));
  },

  // promotePawn: (newPiece) => {
  //   set((state) => {
  //     const { piece, fromRow, fromCol, toRow, toCol } = state.promotionPiece;
  //     const newBoard = state.board.map((r) => [...r]);
  
  //     newBoard[toRow][toCol] = newPiece.toUpperCase();
  //     newBoard[fromRow][fromCol] = "";
  
  //     return {
  //       board: newBoard,
  //       promotionPiece: null,
  //       turn: state.turn === "white" ? "black" : "white",
  //     };
  //   });
  // },

  promotePawn: (type) =>
    set((state) => {
      const { row, col } = state.promotion;
      const newBoard = state.board.map((r) => [...r]);

      newBoard[row][col] = { type, color: state.turn === "white" ? "white" : "black" };
      return { board: newBoard, promotion: null, turn: state.turn === "white" ? "black" : "white", };
    }),

  // Select a piece and calculate possible moves
  selectPiece: ( row, col) => set((state) => {
    const playerColor = useSocketStore.getState().playerColor;
    const piece = state.board[row][col];


    if(!piece) return state;

    if (piece.color !== state.turn) {
      toast.error("Not your turn!");
      return state;
    }

    // ✅ Allow only the current player to select their own pieces
    console.log(piece.color, playerColor ,piece.color !== playerColor)
    if (piece.color !== playerColor) {
      set({ selectedPiece: null, suggestedMoves: [] });
      return state;
    }

    const possibleMoves = getPossibleMoves(piece, row, col, state.board, state.castlingRights, true);

    console.log("possibleMoves :",possibleMoves);

    // Reverse suggestions if player is black
    const finalSuggestedMoves =
    playerColor === "black"
      ? possibleMoves.map((move) => ({
          row: 7 - move.row,
          col: move.col,
        }))
      : possibleMoves;

      console.log("finalSuggestedMoves :",finalSuggestedMoves);
      
      return { selectedPiece: { row, col }, suggestedMoves: finalSuggestedMoves };
    }),


  movePiece: (fromRow, fromCol, toRow, toCol, audioRef) => set((state) => {
    const playerColor = useSocketStore.getState().playerColor;
    const { board, turn } = state;
    const { socket, room } = useSocketStore.getState();

    const piece = state.board[fromRow][fromCol];
    const target = state.board[toRow][toCol];
    const player = state.turn === playerColor ? "you" : "opponent";

    // ✅ Only allow moves if it's the player's turn
    if (piece.color !== playerColor) {
      return state;
    }

    if (!piece || piece.color !== turn) {
      return state;
    }

    if (!isValidMove(piece, fromRow, fromCol, toRow, toCol, board, state.castlingRights)) {
      return state;
    }

    // if (piece?.type === "pawn" && (toRow === 0 || toRow === 7)) {
    //   console.log(`Rank ${toRow + 1}`)
    //   state.openPromotionModal(toRow, toCol); // Open Modal
    //   console.log(state.promotion)
    //   return state; // Stop the move until the user chooses promotion
    // }

    // pawn promotion
    // if (piece?.type.toLowerCase() === "p" && (toRow === 0 || toRow === 7)) {
    //   if (state.promotionPiece) {
    //     piece = state.promotionPiece.toUpperCase();
    //     set({ promotionPiece: null });
    //   } else {
    //     console.log("promote")
    //     set({ promotionPiece: "q" }); // Default Queen
    //     piece.type = "Q";
    //   }
    // }

    // Capture Detection
    
    const isCapture = target !== null && target.color !== piece.color;
    let castling = null;
    let promotion = null;

    if (piece.type === "pawn" && (toRow === 0 || toRow === 7)) {
      promotion = "Q"; // Default promotion to Queen
    }

    if (piece.type === "king" && Math.abs(fromCol - toCol) === 2) {
      castling = fromCol > toCol ? "queen-side" : "king-side";
    }

    
    
    if(isCapture){
      state.capturedPieces[player].push(target);
    }
    
    const newBoard = state.board.map((row) => [...row]);
    
     // Castling Detection
    //  if (piece.type === "king" && Math.abs(fromCol - toCol) === 2) {
    //   if (toCol === 6) {
    //     newBoard[fromRow][5] = newBoard[fromRow][7]; // King-side Rook Move
    //     newBoard[fromRow][7] = null;
    //   }
    //   if (toCol === 2) {
    //     newBoard[fromRow][3] = newBoard[fromRow][0]; // Queen-side Rook Move
    //     newBoard[fromRow][0] = null;
    //   }
    // }
    
    
    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = null;

    const isCheck = isKingInCheck(newBoard, state.turn === "white" ? "black" : "white");
    const isCheckmated = isCheck && getPossibleMoves(newBoard, state.turn).length === 0;
    
    const notation = generateAlgebraicNotation(piece, fromRow, fromCol, toRow, toCol, state.board, isCapture,isCheck,isCheckmated,promotion, castling);
    state.notation[player].push(notation);

    // Disable castling rights after king or rook moves
    if (piece === "K") set({ castlingRights: { ...state.castlingRights, whiteKing: false } });
    if (piece === "k") set({ castlingRights: { ...state.castlingRights, blackKing: false } });
    if (piece === "R" && col === 0) set({ castlingRights: { ...state.castlingRights, whiteRookLeft: false } });
    if (piece === "R" && col === 7) set({ castlingRights: { ...state.castlingRights, whiteRookRight: false } });
    if (piece === "r" && col === 0) set({ castlingRights: { ...state.castlingRights, blackRookLeft: false } });
    if (piece === "r" && col === 7) set({ castlingRights: { ...state.castlingRights, blackRookRight: false } });

    const opponentColor = turn === "white" ? "black" : "white";

    // Emit move to the server
    if (room) {
      useMainSocket.getState().socket.emit("movePiece", { room, move: { from: { row: fromRow, col: fromCol }, to: { row: toRow, col: toCol }, piece } });
    }

    // Check if the opponent's king is in check
    if (isKingInCheck(newBoard, opponentColor)) {
      toast.error(`${opponentColor.charAt(0).toUpperCase() + opponentColor.slice(1)} is in Check!`);
    }
    
    // Check for Checkmate
    if (isCheckmate(newBoard, opponentColor)) {
      
      // useSocketStore.getState().isGameStarted = false;
      useResultStore.getState().setGameResult("win","checkmate");
      useMainSocket.getState().socket.emit("isCheckmated", room);
      state.openGameOverModal(true);

      return { board: initialBoard(), turn: "white", selectedPiece: null, suggestedMoves: [] };
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
    const socket = useMainSocket.getState().socket;

    if(!socket) return { board : initialBoard(), turn : "white",selectedPiece: null, suggestedMoves: []}

    // Remove Existing Listener First
    socket.off("resigned");
    socket.off("checkmate");
    socket.off("updateBoard");
    socket.off("drawAccepted");
    socket.off("newDrawRequest");

    socket.on("resigned", (room)=>{
      set((state)=>{
        useResultStore.getState().setGameResult("win","resign");
        state.openGameOverModal(true);
        return { board : initialBoard(), turn : "white",selectedPiece: null, suggestedMoves: []}
      })
    });

    socket.on("checkmate", (room) =>{
      set((state)=>{
        useResultStore.getState().setGameResult("lose","checkmate");
        state.openGameOverModal(true);
        return { board : initialBoard(), turn : "white",selectedPiece: null, suggestedMoves: []}
      })
    })

    // socket.on("stopGameLogic",(room)=>{
    //   set((state)=>{
    //     state.openGameOverModal(null);
    //   })
    // })

    socket.on("newDrawRequest", (room)=>{
      set((state)=>{ 
        state.openDrawRequest();
        return { board : state.board, turn : "white", selectedPiece: null, suggestedMoves: []}
      })
    })

    socket.on("drawResult", (room)=>{
      set((state)=>{
        useResultStore.getState().setGameResult("draw","draw");
        state.openGameOverModal(true);
        return { board : initialBoard(), turn : "white",selectedPiece: null, suggestedMoves: []}
      })
    })

    socket.on("updateBoard", ({ from, to, piece }) => {
      set((state) => {
        const newBoard = state.board.map((r) => [...r]);

        // Update King Position
        newBoard[to.row][to.col] = piece;
        newBoard[from.row][from.col] = null;

        // Detect Castling and Move Rook
        if (piece.type === "king" && Math.abs(from.col - to.col) === 2) {
  
          if (to.col === 6) {
            newBoard[to.row][5] = newBoard[to.row][7]; // King-side Rook Move
            newBoard[to.row][7] = null;
          }
          if (to.col === 2) {
            newBoard[to.row][3] = newBoard[to.row][0]; // Queen-side Rook Move
            newBoard[to.row][0] = null;
          }
        }

        let promotion = null;
        const isCapture = state.board[to.row][to.col] !== null;
        const isCastling = piece.type === "king" && Math.abs(from.col - to.col) === 2;

        // // Castling
        // if (isCastling) {
        //   if (to.col === 6) {
        //     return { notation: { ...state.notation, opponent: [...state.notation.opponent, "O-O"] } };
        //   }
        //   if (to.col === 2) {
        //     return { notation: { ...state.notation, opponent: [...state.notation.opponent, "O-O-O"] } };
        //   }
        // }

        // Pawn Promotion
        if (piece.type === "pawn" && (to.row === 0 || to.row === 7)) {
          promotion = "Q";
        }

        const isCheck = isKingInCheck(newBoard, state.turn === "white" ? "black" : "white");
        const isCheckmate = isCheck && getPossibleMoves(newBoard, state.turn).length === 0;

        const notation = generateAlgebraicNotation(
          piece, from.row, 
          from.col, to.row, 
          to.col,newBoard,
          isCapture,isCheck,
          isCheckmate,promotion,
          isCastling
        );

        state.notation.opponent.push(notation); // ✅ Store opponent's move

        return { 
          board: newBoard, 
          turn: state.turn === "white" ? "black" : "white", 
          suggestedMoves: [],
          notation : {...state.notation} 
        };
      });
    });
  },
}));

export default useChessStore;
