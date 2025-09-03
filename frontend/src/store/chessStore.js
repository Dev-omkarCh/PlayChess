
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
import { useRoom } from "../hooks/useRoom";
import useSettingStore from "./settingStore";
import { playChessSound } from "../utils/playChessSound";
import { use } from "react";
import { color } from "framer-motion";
import clearChessData from "@/utils/clearChessData";
import { messageStore } from "./messageStore";

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
  soundPerMove: false,
  openDrawRequest: () => set({ drawRequest: true }),
  closeDrawRequest: () => set({ drawRequest: false }),

  resetBoard :() => set({ 
    board: initialBoard(),
    turn: "white",
    selectedPiece: null, 
    suggestedMoves: []
  }),

  isInCheck: false,

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

  result : null,
  type : null,
  openDummyModal: (result, type) => set({ result : result, type : type}),

  gameOver: null, // "win", "lose", "resign"
  openGameOverModal: (result) => set({ gameOver: result }),
  closeGameOverModal: () => set({ gameOver: null }),

  changeGameState : () => set((state)=>{
    const status = JSON.parse(localStorage.getItem("gameStatus"));
    console.log("In changeGameState: status", status)
  }),

  promote : (piece) => set((state)=>{
    
    let newBoard = [...state.board];
    const { row, col, color } = state.promotionSquare;

    let promotedPiece = { type: piece?.type, color};

    newBoard[row][col] = promotedPiece;
    state.setPromotionSquare(null);

    useMainSocket.getState().socket?.emit("pawnPromotion",{ piece: promotedPiece, board: newBoard })

    return { board : newBoard }
  }),

  setGameState: ({ board, turn, notations, playerColor, roomId, white, black }) =>
    set({
      board,
      turn,
      notations,
      // playerColor,
      // roomId,
      // whiteId: white,
      // blackId: black,
    }),

  reconnectGame : () => set(async(state)=>{
      const data = await fetch(`/api/users/game/reconnect`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          board: state.board, 
          turn: state.turn, 
          notations: state.notation, 
          playerColor: useSocketStore.getState().playerColor,
          capturedPieces: state.capturedPieces,
          opponent: useResultStore.getState().opponent,
          roomId : useSocketStore.getState().room
        })
      });
      const res = await data.json();
      toast.success(res.msg);
      return;
  }),

  openPromotionModal: (row, col) => {
    set(()=>({
      promotion: { row, col }, // Force new object reference
    }));
  },

  promotionSquare: null,
  setPromotionSquare: (promotionSquare) => set({ promotionSquare }),

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
  // Move Piece
  movePiece: (fromRow, fromCol, toRow, toCol) => set((state) => {

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
      playChessSound("capture");
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
      playChessSound("check");
    }
    
    // Check for Checkmate
    if (isCheckmate(newBoard, opponentColor)) {
      
      // useSocketStore.getState().isGameStarted = false;

      playChessSound("checkmate");

      useResultStore.getState().setGameResult("win","checkmate");
      useMainSocket.getState().socket.emit("isCheckmated", room);
      state.openGameOverModal(true);

      return { board: initialBoard(), turn: "white", selectedPiece: null, suggestedMoves: [] };
    }

    playChessSound("move");
    
    return { board: newBoard, turn: playerColor, selectedPiece: null, suggestedMoves: [] };
  }),

  // Move Piece by click
  movePieceByClick: (row, col) => set((state) => {

    const playerColor = useSocketStore.getState().playerColor;
    const { board, turn, selectedPiece, suggestedMoves, capturedPieces, isInCheck, promotionSquare, setPromotionSquare } = state;
    const { socket, room } = useSocketStore.getState();

    let isCapture = false;
    let switchTurn = turn === "white" ? "black" : "white";

    const piece = board[row][col];
    const player = turn === playerColor ? "you" : "opponent";
    const opponentColor = playerColor === "white" ? "black" : "white";
    const newBoard = board;

    // position of the piece you want to move
    const previousRow = selectedPiece?.row;
    const previousCol = selectedPiece?.col;

    

    // clicked piece is null and selectedPiece exists then, move piece
    // the square moving if has a piece and its color is different form ours and selectedPiece exists then, capture piece
    if(piece === null && selectedPiece || piece?.color !== playerColor && selectedPiece){

      // the piece we selected, as piece is the square we want to go not the actual square we selected
      const newPiece = newBoard[previousRow][previousCol];

      // Only allow the current player to move their own pieces
      // if (newPiece?.color !== playerColor && piece?.color !== turn) {
      //   toast.error("diff color")
      //   return state;
      // }

      // Validate the move
      if (!isValidMove(newPiece, previousRow, previousCol, row, col, newBoard, state?.castlingRights)) {
        playChessSound("illegal");
        return state;
      }

      
      // helps avoid moving null squares and stucked pieces
      if(!suggestedMoves){
         toast.error("not in suggested moves")
        return state;
      }

      // check for pawn promotion
    if (
      (newPiece?.type === "pawn" && row === 0) || // black pawn reaches rank 1
      (newPiece?.type === "pawn" && row === 7)    // white pawn reaches rank 8
    ) {
      setPromotionSquare({ row, col, color: newPiece?.color });
    }

      // check for castling
      let castling = null;
      if (newPiece?.type === "king" && Math.abs(previousCol - col) === 2 || newPiece?.type === "king" && Math.abs(previousCol - col) === 6) {
        castling = previousCol > col ? "queen-side" : "king-side";
      }

      // checks if the square you are moving your piece to-- exists in suggestedMoves as it helps us know that its a valid move
      const finalSuggestedMoves = suggestedMoves.filter(move =>{
        
        // adjust the row if player is black
        const adjustedRow = playerColor === "black" ? 7 - row : row;

        if(move?.row === adjustedRow && move?.col === col){

          // edge case for castling ( moving rook)
          if(castling){
              if (col === 6) {
                console.log("castling king-side");
                // newBoard[previousRow][5] = newBoard[previousRow][7]; // King-side Rook Move
                // newBoard[previousRow][7] = null;
              
              }
              if (col === 2) {
                console.log("castling Queen-side");
                // newBoard[previousRow][3] = newBoard[previousRow][0]; // Queen-side Rook Move
                // newBoard[previousRow][0] = null;
                
              }
              playChessSound("castle");
          }
          
          // the code that actually moves the piece in board
          newBoard[row][col] = newPiece;
          newBoard[previousRow][previousCol] = null;
          return move;

        }
      });
      
      // helps avoid adding notation of invalid move
      if(finalSuggestedMoves?.length === 0) return { 
        board: newBoard, 
        turn: playerColor, 
        selectedPiece: null, 
        suggestedMoves: [] 
      };

      // check for this conditions
      const isCheck = isKingInCheck(newBoard, turn === "white" ? "black" : "white");
      const isCheckmated = isCheck && getPossibleMoves(newBoard, turn).length === 0;

      // Disable castling rights after king or rook moves
      if (piece === "K") set({ castlingRights: { ...state.castlingRights, whiteKing: false } });
      if (piece === "k") set({ castlingRights: { ...state.castlingRights, blackKing: false } });
      if (piece === "R" && col === 0) set({ castlingRights: { ...state.castlingRights, whiteRookLeft: false } });
      if (piece === "R" && col === 7) set({ castlingRights: { ...state.castlingRights, whiteRookRight: false } });
      if (piece === "r" && col === 0) set({ castlingRights: { ...state.castlingRights, blackRookLeft: false } });
      if (piece === "r" && col === 7) set({ castlingRights: { ...state.castlingRights, blackRookRight: false } });
      
      // notate the move
      // const notation = generateAlgebraicNotation(newPiece, selectedPiece.row, selectedPiece.col, row, col, board, isCapture, isCheck ,isCheckmated,false, castling);
      // state.notation["you"]?.push(notation);

      if (isCheckmate(newBoard, opponentColor)) {
        playChessSound("checkmate");
        toast.error("Checkmate")

        useResultStore.getState().setGameResult("win","checkmate");
        useMainSocket.getState().socket.emit("isCheckmated", room);
        state.openGameOverModal(true);

        localStorage.removeItem("gameExists");
        localStorage.removeItem("state");
        localStorage.removeItem("reload");
        localStorage.removeItem("roomId");

        return { board: initialBoard(), turn: "white", selectedPiece: null, suggestedMoves: [] }
      }

      if (isKingInCheck(newBoard, opponentColor)) {
        playChessSound("check");
        toast.error("Check");

        if (room) {
          console.log("send move on check")
          useMainSocket.getState().socket.emit("movePiece", { room, move: { from: { row: previousRow, col: previousCol }, to: { row: row, col: col }, piece : newPiece } });
        }
        
        return { board: newBoard, turn: switchTurn, selectedPiece: null, suggestedMoves: [], isCheck : true };
      }

      // if the piece we are moving to the sqaure already has a piece(not our color), then capture it and store.
      if(piece){

        const captured = {
          piece : newBoard[row][col],
          position : { row, col },
          capturer : newBoard[previousRow][previousCol],
          capturerPosition : { row : previousRow, col : previousCol }
        }

        isCapture = true;
        playChessSound("capture");
        capturedPieces["you"]?.push(captured);
        
      }

      const notation = generateAlgebraicNotation(newPiece, selectedPiece.row, selectedPiece.col, row, col, board, isCapture, isCheck ,isCheckmated,false, castling);
      state.notation["you"]?.push(notation);

      // only play move piece sound when not of the sounds are played or it will merge all the sounds
      if(!isCapture && !castling && !isCheck && !isCheckmated){
        playChessSound("move");
      }

      // Emit move to the server
      if (room) {
        console.log("send move")
        useMainSocket.getState().socket.emit("movePiece", { room, move: { from: { row: previousRow, col: previousCol }, to: { row: row, col: col }, piece : newPiece } });
      }

      localStorage.setItem("state", JSON.stringify({
        board: newBoard,
        turn: switchTurn,
        roomId : room,
        playerColor,
      }));

      return { board: newBoard, turn: switchTurn, selectedPiece: null, suggestedMoves: [] };
    
    }

    return state;
  }),

  // listenFor Moves
  listenForMoves: () => {
    const socket = useMainSocket.getState().socket;
    const { playerColor, room } = useSocketStore();

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
        clearChessData();
        return { board : initialBoard(), turn : "white",selectedPiece: null, suggestedMoves: []}
      })
    });

    socket.on("updateBoardOnPawnPromotion",({ piece, board }) =>{
      set((state)=>{

        const newBoard = board;
        console.log("(chessStore.js/updateBoardOnPawnPromotion) piece:", piece, board);
        return { board: newBoard, promotionSquare: null };
      })
    });

    socket.on("checkmate", (room) =>{
      set((state)=>{

        localStorage.removeItem("state");
        localStorage.removeItem("reload");
        localStorage.removeItem("roomId");

        useResultStore.getState().setGameResult("lose","checkmate");
        state.openGameOverModal(true);
        return { board : initialBoard(), turn : "white", selectedPiece: null, suggestedMoves: [] }
      });
    });

    socket.on("newDrawRequest", (room)=>{
      set((state)=>{ 
        state.openDrawRequest();
        return { board : state.board, turn : state.turn, selectedPiece: null, suggestedMoves: []}
      })
    });

    socket.on("drawResult", (room)=>{
      set((state)=>{
        useResultStore.getState().setGameResult("draw","draw");
        state.openGameOverModal(true);
        return { board : initialBoard(), turn : "white",selectedPiece: null, suggestedMoves: []}
      })
    });

    socket.on("updateBoard", ({ from, to, piece }) => {
      set((state) => {
        const { board, turn } = state;

        const newBoard = state.board.map((r) => [...r]);
        const switchTurn = turn === "white" ? "black" : "white";

        // Update King Position
        newBoard[to.row][to.col] = piece;
        newBoard[from.row][from.col] = null;

        // Detect Castling and Move Rook
        if (piece?.type === "king" && Math.abs(from.col - to.col) === 2) {
  
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
        const isCastling = piece?.type === "king" && Math.abs(from.col - to.col) === 2;

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
        if (piece?.type === "pawn" && (to.row === 0 || to.row === 7)) {
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

        localStorage.setItem("state", JSON.stringify({
          board: newBoard,
          turn: switchTurn,
          roomId : room,
          playerColor,
        }));

        return { 
          board: newBoard, 
          turn: state.turn === "white" ? "black" : "white", 
          suggestedMoves: [],
          notation: state.notation
        };
      });
    });
  },
}));

export default useChessStore;
