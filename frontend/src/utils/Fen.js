
const pieceMapper = (piece) => {
    if (!piece) return null
    else if (piece.color === 'black' && piece.type === 'rook') return 'bR'
    else if (piece.color === 'black' && piece.type === 'knight') return 'bN'
    else if (piece.color === 'black' && piece.type === 'bishop') return 'bB'
    else if (piece.color === 'black' && piece.type === 'queen') return 'bQ'
    else if (piece.color === 'black' && piece.type === 'king') return 'bK'
    else if (piece.color === 'black' && piece.type === 'pawn') return 'bP'
    else if (piece.color === 'white' && piece.type === 'rook') return 'wR'
    else if (piece.color === 'white' && piece.type === 'knight') return 'wN'
    else if (piece.color === 'white' && piece.type === 'bishop') return 'wB'
    else if (piece.color === 'white' && piece.type === 'queen') return 'wQ'
    else if (piece.color === 'white' && piece.type === 'king') return 'wK'
    else if (piece.color === 'white' && piece.type === 'pawn') return 'wp'
};

const typeMapper = (type) => {
    if (type === "R") return 'rook'
    else if (type === "B") return 'bishop'
    else if (type === "N") return 'knight'
    else if (type === "Q") return 'queen'
    else if (type === "K") return 'king'
    else if (type === "P") return 'pawn'
};

export const generateFEN = (board, turn, castling, enPassant, halfMove, fullMove) => {
    let fen = "";

    // 1. Piece Placement (Rank 8 down to Rank 1)
    for (let r = 0; r < 8; r++) {
        let emptyCount = 0;
        for (let c = 0; c < 8; c++) {
            const pieceObject = board[r][c]; // Expected format: 'wP', 'bK', or null
            const piece = pieceMapper(pieceObject);

            if (piece === null) {
                emptyCount++;
            } else {
                if (emptyCount > 0) {
                    fen += emptyCount;
                    emptyCount = 0;
                }
                // Convert 'wP' -> 'P', 'bK' -> 'k'
                const char = piece[1];
                fen += (piece[0] === 'w') ? char.toUpperCase() : char.toLowerCase();
            }
        }
        if (emptyCount > 0) fen += emptyCount;
        if (r < 7) fen += "/";
    }

    // 2. Active Color
    fen += ` ${turn}`; // 'w' or 'b'

    // 3. Castling Rights
    // castling should be a string like "KQkq" or "-" if none
    fen += ` ${castling || "-"}`;

    // 4. En Passant Target Square
    // e.g., "e3" or "-"
    fen += ` ${enPassant || "-"}`;

    // 5. Halfmove Clock
    fen += ` ${halfMove}`;

    // 6. Fullmove Number
    fen += ` ${fullMove}`;

    return fen;
};

export const parseFEN = (fen) => {
    const parts = fen.split(" ");
    const boardPart = parts[0]; // The piece placement section

    const board = [];
    const rows = boardPart.split("/");

    for (let row of rows) {
        const boardRow = [];
        for (let char of row) {
            if (isNaN(char)) {
                // It's a piece: Uppercase = White, Lowercase = Black
                const color = (char === char.toUpperCase()) ? 'w' : 'b';
                const type = char.toUpperCase();

                const pieceObj = {
                    color: color === "w" ? "white" : "black",
                    type: typeMapper(type)
                }

                boardRow.push(pieceObj); // Results in 'wP', 'bK', etc.
            } else {
                // It's a number: add that many nulls
                const numEmpty = parseInt(char);
                for (let i = 0; i < numEmpty; i++) {
                    boardRow.push(null);
                }
            }
        }
        board.push(boardRow);
    }

    // Extracting Metadata (Optional - store these in your game state)
    const gameState = {
        board: board,
        turn: parts[1],
        castling: parts[2],
        enPassant: parts[3],
        halfMove: parseInt(parts[4]),
        fullMove: parseInt(parts[5])
    };

    return gameState;
};