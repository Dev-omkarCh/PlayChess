export const initialBoard = () => {
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