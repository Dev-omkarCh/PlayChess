import { useState } from "react";
import { initialBoard } from "../utils/initialBoard";
import useSocketStore from '../store/socketStore';
import toast from "react-hot-toast";
import { getPossibleMoves, isCheckmate, isKingInCheck, isValidMove } from "../utils/chessLogic";
import { useMainSocket } from "../store/socketIoStore";
import { playChessSound } from "../utils/playChessSound";
import { useResultStore } from "../store/resultStore";
import { generateAlgebraicNotation } from "../utils/generateNotation";
import useTurn from "../store/turnStore";

const useChessStore = () => {

    const [drawRequest, setDrawRequest] = useState(false);
    const [board, setBoard] = useState(initialBoard());

    const { room } = useSocketStore();
    const [ playerColor, setPlayerColor ] = useState("white");
    const [turn, setTurn] = useState("white");
    const { socket } = useMainSocket();
    const { setGameResult } = useResultStore();


    const castlingRights = {
        whiteKing: true,
        blackKing: true,
        whiteRookLeft: true,
        whiteRookRight: true,
        blackRookLeft: true,
        blackRookRight: true
    }

    const [selectedPiece, setSelectedPiece] = useState(null);
    const [suggestedMoves, setSuggestedMoves] = useState([]);

    const [capturedPieces, setCapturedPieces] = useState({ you: [], opponent: [] });
    const [notation, setNotation] = useState({ you: [], opponent: [] });

    const [gameOver, setGameOver] = useState(null);

    const openGameOverModal = (result) => {
        setGameOver(result);
    }

    const closeGameOverModal = () => {
        setGameOver(null);
    }

    const movePiece = (fromRow, fromCol, toRow, toCol) => {

        const piece = board[fromRow][fromCol];
        const target = board[toRow][toCol];
        const player = turn === playerColor ? "you" : "opponent";
        const promotion = null;

        console.log("turn : ",turn);
        console.log("piece : ",piece);
        console.log("playerColor : ",playerColor);
        console.log("target : ",target);

        // no piece was selected
        if (!piece) return { board, turn, selectedPiece: null, suggestedMoves: [] };

        // can only move piece of your color
        if (piece.color !== playerColor || piece.color !== turn) return;

        if (!isValidMove(piece, fromRow, fromCol, toRow, toCol, board, castlingRights)) {
            return { board, turn, selectedPiece: null, suggestedMoves: [] };
        }

        const isCapture = target !== null && target.color !== piece.color;
        let castling = null;

        if (piece.type === "king" && Math.abs(fromCol - toCol) === 2) {
            castling = fromCol > toCol ? "queen-side" : "king-side";
        }

        if (isCapture) {
            playChessSound("capture");
            capturedPieces[player].push(target);
        }

        const newBoard = board.map((row) => [...row]);
        newBoard[toRow][toCol] = piece;
        newBoard[fromRow][fromCol] = null;

        const isCheck = isKingInCheck(newBoard, turn === "white" ? "black" : "white");
        const isCheckmated = isCheck && getPossibleMoves(newBoard, turn).length === 0;

        const notations = generateAlgebraicNotation(piece, fromRow, fromCol, toRow, toCol, board, isCapture, isCheck, isCheckmated, promotion, castling);
        notation[player].push(notations);

        // Disable castling rights after king or rook moves
        if (piece === "K") set({ castlingRights: { ...state.castlingRights, whiteKing: false } });
        if (piece === "k") set({ castlingRights: { ...state.castlingRights, blackKing: false } });
        if (piece === "R" && col === 0) set({ castlingRights: { ...state.castlingRights, whiteRookLeft: false } });
        if (piece === "R" && col === 7) set({ castlingRights: { ...state.castlingRights, whiteRookRight: false } });
        if (piece === "r" && col === 0) set({ castlingRights: { ...state.castlingRights, blackRookLeft: false } });
        if (piece === "r" && col === 7) set({ castlingRights: { ...state.castlingRights, blackRookRight: false } });

        const opponentColor = playerColor === "white" ? "black" : "white";

        if (room) {
            socket.emit("movePiece", {
                room,
                move: {
                    from: {
                        row: fromRow,
                        col: fromCol
                    },
                    to: {
                        row: toRow,
                        col: toCol
                    },
                    piece
                }
            });
        }

        // Check if the opponent's king is in check
        if (isKingInCheck(newBoard, opponentColor)) {
            playChessSound("check");
        }

        // Check for Checkmate
        if (isCheckmate(newBoard, opponentColor)) {

            playChessSound("checkmate");

            setGameResult("win", "checkmate");
            socket.emit("isCheckmated", room);
            openGameOverModal(true);

            setBoard(initialBoard());
            setTurn(turn);
            setSelectedPiece(null);
            suggestedMoves([]);

            return { board: initialBoard(), turn, selectedPiece: null, suggestedMoves: [] };
        }

        playChessSound("move");

        console.log("board: ", newBoard);
        console.log("turn: ", turn);
        console.log("opponentColor: ", opponentColor);
        console.log("selectedPiece: ", selectedPiece);
        console.log("suggestedMoves: ", suggestedMoves);

        setBoard(newBoard);
        setTurn(opponentColor);
        setSelectedPiece(null);
        setSuggestedMoves([]);

        console.log("board: ", newBoard);
        console.log("turn: ", turn, opponentColor);
        console.log("selectedPiece: ", selectedPiece);
        console.log("suggestedMoves: ", suggestedMoves);

        return { board: newBoard, turn: opponentColor, selectedPiece: null, suggestedMoves: [] };

    }

    const movePieceByClick = (fromRow, fromCol, toRow, toCol) =>{

        const piece = board[fromRow][fromCol];
        const target = board[toRow][toCol];

        
    }

    const selectPiece = (row, col) => {

        const piece = board[row][col];
        if (!piece) return { board, turn, selectedPiece: null, suggestedMoves: [] };

        if (piece.color !== turn || piece.color !== playerColor) {
            toast.error("Not your turn!");
            return { board, turn, selectedPiece: null, suggestedMoves: [] };
        }

        const possibleMoves = getPossibleMoves(piece, row, col, board, castlingRights, true);

        console.log("possibleMoves :", possibleMoves);

        // Reverse suggestions if player is black
        const finalSuggestedMoves =
            playerColor === "black"
                ? possibleMoves.map((move) => ({
                    row: 7 - move.row,
                    col: move.col,
                }))
                : possibleMoves;

        console.log("finalSuggestedMoves :", finalSuggestedMoves);

        setSelectedPiece({ row, col });
        setSuggestedMoves(finalSuggestedMoves);

        return { selectedPiece: { row, col }, suggestedMoves: finalSuggestedMoves };
    }

    const listenForMoves = () => {

        if (!socket) {
            return { board, turn, selectedPiece: null, suggestedMoves: [] }
        }

        // Remove Existing Listener First
        socket.off("resigned");
        socket.off("checkmate");
        socket.off("updateBoard");
        socket.off("drawAccepted");
        socket.off("newDrawRequest");

        socket.on("resigned", (room) => {
            setGameResult("win", "resign");
            openGameOverModal(true);
            return { board, turn, selectedPiece: null, suggestedMoves: [] }
        });

        socket.on("checkmate", (room) => {
            setGameResult("lose", "checkmate");
            openGameOverModal(true);
            return { board: initialBoard(), turn: "white", selectedPiece: null, suggestedMoves: [] }
        });

        socket.on("newDrawRequest", (room) => {
            setDrawRequest(true);
            return { board, turn, selectedPiece: null, suggestedMoves: [] }
        });

        socket.on("drawResult", (room) => {
            setGameResult("draw", "draw");
            openGameOverModal(true);
            return { board, turn, selectedPiece: null, suggestedMoves: [] }
        });

        socket.on("updateBoard", ({ from, to, piece }) => {
            const newBoard = board.map((r) => [...r]);
            const opponentColor = turn === "white" ? "black" : "white";

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

            const isCapture = board[to.row][to.col] !== null;
            const isCastling = piece.type === "king" && Math.abs(from.col - to.col) === 2;

            // Pawn Promotion
            // if (piece.type === "pawn" && (to.row === 0 || to.row === 7)) {
            //     promotion = "Q";
            // }

            const isCheck = isKingInCheck(newBoard, turn === "white" ? "black" : "white");
            const isCheckmate = isCheck && getPossibleMoves(newBoard, turn).length === 0;
            let promotion = null;

            const notations = generateAlgebraicNotation(
                piece, 
                from.row,
                from.col, 
                to.row,
                to.col, 
                newBoard,
                isCapture, 
                isCheck,
                isCheckmate, 
                promotion,
                isCastling
            );

            notation.opponent.push(notations); // ✅ Store opponent's move

            setBoard(newBoard);
            setTurn(opponentColor);
            setSuggestedMoves([]);
            setSelectedPiece(null);

            return {
                board: newBoard,
                turn: opponentColor,
                suggestedMoves: [],
                notation
            };
        });
    }

    const getState = () =>{
        
    }

    return {
        board,
        playerColor, setPlayerColor,
        drawRequest, setDrawRequest,
        castlingRights,
        turn, setTurn,
        selectedPiece, setSelectedPiece,
        suggestedMoves, setSuggestedMoves,
        capturedPieces, setCapturedPieces,
        notation, setNotation,
        gameOver, setGameOver,
        openGameOverModal, closeGameOverModal,
        movePiece,
        selectPiece,
        listenForMoves

    }
};

export default useChessStore;
