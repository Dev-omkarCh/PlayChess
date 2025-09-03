export function generateAlgebraicNotation(piece, fromRow, fromCol, toRow, toCol, board, isCapture, isCheck = false, isCheckmate = false, promotion = null, castling = null) {
    const columns = "abcdefgh";
    // const from = columns[fromCol] + (8 - fromRow);
    const to = columns[toCol] + (8 - toRow);
    const symbol = piece?.type === "pawn" ? "" : piece?.type[0].toUpperCase();

    if (castling === "king-side") {
      return "O-O"; // King-side castling
    }

    if (castling === "queen-side") {
      return "O-O-O"; // Queen-side castling
    }
  
    let notation = isCapture ? `${symbol}x${to}` : `${symbol}${to}`;

    if (promotion) {
      notation += `=${promotion.toUpperCase()}`;
    }

    if (isCheck) {
      notation += `+`;
    }
  
    if (isCheckmate) {
      notation += `#`;
    }

    return notation;
  }