export const isValidMove = (piece, fromRow, fromCol, toRow, toCol, board) => {
    if (!piece) return false;
    const { type, color } = piece;
    const targetSquare = board[toRow][toCol];
  
    // Prevent moving onto a piece of the same color
    if (targetSquare && targetSquare.color === color) return false;
  
    switch (type) {
      case "pawn":
        return validatePawnMove(fromRow, fromCol, toRow, toCol, board, color);
      case "rook":
        return validateRookMove(fromRow, fromCol, toRow, toCol, board);
      case "knight":
        return validateKnightMove(fromRow, fromCol, toRow, toCol);
      case "bishop":
        return validateBishopMove(fromRow, fromCol, toRow, toCol, board);
      case "queen":
        return validateQueenMove(fromRow, fromCol, toRow, toCol, board);
      case "king":
        return validateKingMove(fromRow, fromCol, toRow, toCol, board);
      default:
        return false;
    }
  };
  
  // **Pawn Move Logic**
  const validatePawnMove = (fromRow, fromCol, toRow, toCol, board, color) => {
    const direction = color === "white" ? -1 : 1;
    const startRow = color === "white" ? 6 : 1;
  
    // Normal Move (1 step forward)
    if (toRow === fromRow + direction && toCol === fromCol && !board[toRow][toCol]) {
      return true;
    }
  
    // First Move (2 steps forward)
    if (fromRow === startRow && toRow === fromRow + 2 * direction && toCol === fromCol && !board[toRow][toCol] && !board[fromRow + direction][toCol]) {
      return true;
    }
  
    // Capture Move (Diagonal)
    if (toRow === fromRow + direction && Math.abs(toCol - fromCol) === 1 && board[toRow][toCol]) {
      return true;
    }
  
    return false;
  };
  
  // **Rook Move Logic**
  const validateRookMove = (fromRow, fromCol, toRow, toCol, board) => {
    if (fromRow !== toRow && fromCol !== toCol) return false;
    return isPathClear(fromRow, fromCol, toRow, toCol, board);
  };
  
  // **Knight Move Logic**
  const validateKnightMove = (fromRow, fromCol, toRow, toCol) => {
    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
  };
  
  // **Bishop Move Logic**
  const validateBishopMove = (fromRow, fromCol, toRow, toCol, board) => {
    if (Math.abs(fromRow - toRow) !== Math.abs(fromCol - toCol)) return false;
    return isPathClear(fromRow, fromCol, toRow, toCol, board);
  };
  
  // **Queen Move Logic (Combination of Rook & Bishop)**
  const validateQueenMove = (fromRow, fromCol, toRow, toCol, board) => {
    return validateRookMove(fromRow, fromCol, toRow, toCol, board) || validateBishopMove(fromRow, fromCol, toRow, toCol, board);
  };
  
  // **King Move Logic**
  const validateKingMove = (fromRow, fromCol, toRow, toCol) => {
    return Math.abs(fromRow - toRow) <= 1 && Math.abs(fromCol - toCol) <= 1;
  };
  
  // **Path Clearance Check**
  const isPathClear = (fromRow, fromCol, toRow, toCol, board) => {
    const rowStep = fromRow === toRow ? 0 : fromRow < toRow ? 1 : -1;
    const colStep = fromCol === toCol ? 0 : fromCol < toCol ? 1 : -1;
  
    let row = fromRow + rowStep;
    let col = fromCol + colStep;
  
    while (row !== toRow || col !== toCol) {
      if (board[row][col]) return false;
      row += rowStep;
      col += colStep;
    }
    
    return true;
  };
  // Check if the King is under attack
// export const isKingInCheck = (color, board) => {
//     let kingPosition = null;
  
//     // Find the king's position
//     for (let row = 0; row < 8; row++) {
//       for (let col = 0; col < 8; col++) {
//         if (board[row][col]?.type === "king" && board[row][col]?.color === color) {
//           kingPosition = { row, col };
//           break;
//         }
//       }
//     }
  
//     if (!kingPosition) return false; // King not found (error case)
  
//     // Check if any opponent piece can attack the king
//     for (let row = 0; row < 8; row++) {
//       for (let col = 0; col < 8; col++) {
//         const piece = board[row][col];
//         if (piece && piece.color !== color) {
//           if (isValidMove(piece, row, col, kingPosition.row, kingPosition.col, board)) {
//             return true; // King is in check
//           }
//         }
//       }
//     }
  
//     return false;
//   };


  
  // Check if a player has any legal move left
  export const hasLegalMoves = (color, board) => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.color === color) {
          for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
              if (isValidMove(piece, row, col, toRow, toCol, board)) {
                return true; // At least one legal move is available
              }
            }
          }
        }
      }
    }
    return false;
  };

  // Check if the King is in check
  export const isKingInCheck = (board, kingColor) => {
    let kingPosition = null;
  
    // Find the king's position
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col]?.type === "king" && board[row][col]?.color === kingColor) {
          kingPosition = { row, col };
          break;
        }
      }
    }
  
    if (!kingPosition) return false; // King not found (shouldn't happen)
  
    // Check if any opponent piece can attack the king
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.color !== kingColor) {
          const possibleMoves = getPossibleMoves(piece, row, col, board);
          if (possibleMoves.some((move) => move.row === kingPosition.row && move.col === kingPosition.col)) {
            return true; // King is in check
          }
        }
      }
    }
  
    return false;
  };

  // Check if the King is in checkmate
  export const isCheckmate = (board, kingColor) => {
    if (!isKingInCheck(board, kingColor)) return false; // If not in check, it's not checkmate
  
    // Go through every piece of the current player
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.color === kingColor) {
          const possibleMoves = getPossibleMoves(piece, row, col, board);
          
          // Try each move to see if any move gets the king out of check
          for (let move of possibleMoves) {
            const tempBoard = board.map((r) => [...r]); // Clone the board
            tempBoard[move.row][move.col] = piece;
            tempBoard[row][col] = null;
  
            if (!isKingInCheck(tempBoard, kingColor)) {
              return false; // Found a move that saves the king
            }
          }
        }
      }
    }
  
    return true; // No legal moves left → checkmate
  };
  
  
  
  // Determine game state (Checkmate / Stalemate)
  export const checkGameState = (color, board) => {
    if (isKingInCheck(color, board) && !hasLegalMoves(color, board)) {
      return "checkmate";
    }
    if (!isKingInCheck(color, board) && !hasLegalMoves(color, board)) {
      return "stalemate";
    }
    return "ongoing";
  };

  export const getPossibleMoves = (piece, row, col, board) => {
    let moves = [];
  
    if (!piece) return moves;
  
    switch (piece.type) {
      case "pawn":
        moves = getPawnMoves(piece, row, col, board);
        break;
      case "rook":
        moves = getRookMoves(piece, row, col, board);
        break;
      case "knight":
        moves = getKnightMoves(piece, row, col, board);
        break;
      case "bishop":
        moves = getBishopMoves(piece, row, col, board);
        break;
      case "queen":
        moves = [...getRookMoves(piece, row, col, board), ...getBishopMoves(piece, row, col, board)];
        break;
      case "king":
        moves = getKingMoves(piece, row, col, board);
        break;
      default:
        break;
    }
  
    return moves;
  };

  // Pawn Movement Logic
  // const getPawnMoves = (piece, row, col, board) => {
  //   let moves = [];
  //   const direction = piece.color === "white" ? -1 : 1; // White moves up (-1), Black moves down (+1)
  
  //   // Normal move
  //   if (!board[row + direction]?.[col]) {
  //     moves.push({ row: row + direction, col });
  //   }
  
  //   // First move (can move 2 squares)
  //   if ((piece.color === "white" && row === 6) || (piece.color === "black" && row === 1)) {
  //     if (!board[row + direction]?.[col] && !board[row + 2 * direction]?.[col]) {
  //       moves.push({ row: row + 2 * direction, col });
  //     }
  //   }
  
  //   // Capture diagonally
  //   [col - 1, col + 1].forEach((newCol) => {
  //     if (board[row + direction]?.[newCol]?.color !== piece.color) {
  //       moves.push({ row: row + direction, col: newCol });
  //     }
  //   });
  
  //   return moves;
  // };
  const getPawnMoves = (piece, row, col, board) => {
    let moves = [];
    const direction = piece.color === "white" ? -1 : 1; // White moves up (-1), Black moves down (+1)
  
    // Normal forward move (only if the square is empty)
    if (!board[row + direction]?.[col]) {
      moves.push({ row: row + direction, col });
    }
  
    // First move (can move 2 squares if the path is clear)
    if ((piece.color === "white" && row === 6) || (piece.color === "black" && row === 1)) {
      if (!board[row + direction]?.[col] && !board[row + 2 * direction]?.[col]) {
        moves.push({ row: row + 2 * direction, col });
      }
    }
  
    // Capture moves (only if an opponent's piece is present diagonally)
    [[row + direction, col - 1], [row + direction, col + 1]].forEach(([r, c]) => {
      if (r >= 0 && r < 8 && c >= 0 && c < 8 && board[r][c] && board[r][c].color !== piece.color) {
        moves.push({ row: r, col: c });
      }
    });
  
    return moves;
  };
 
  // Rook Movement Logic
  const getRookMoves = (piece, row, col, board) => {
    let moves = [];
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  
    for (let [dx, dy] of directions) {
      let r = row + dx, c = col + dy;
  
      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (!board[r][c]) {
          moves.push({ row: r, col: c });
        } else {
          if (board[r][c].color !== piece.color) moves.push({ row: r, col: c });
          break;
        }
        r += dx;
        c += dy;
      }
    }
    return moves;
  };
  
  // Knight Movement Logic
  const getKnightMoves = (piece, row, col, board) => {
    let moves = [];
    const movesList = [
      [2, 1], [2, -1], [-2, 1], [-2, -1],
      [1, 2], [1, -2], [-1, 2], [-1, -2]
    ];
  
    movesList.forEach(([dx, dy]) => {
      let r = row + dx, c = col + dy;
      if (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (!board[r][c] || board[r][c].color !== piece.color) {
          moves.push({ row: r, col: c });
        }
      }
    });
  
    return moves;
  };
  
  // Bishop Movement Logic
  const getBishopMoves = (piece, row, col, board) => {
    let moves = [];
    const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  
    for (let [dx, dy] of directions) {
      let r = row + dx, c = col + dy;
  
      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (!board[r][c]) {
          moves.push({ row: r, col: c });
        } else {
          if (board[r][c].color !== piece.color) moves.push({ row: r, col: c });
          break;
        }
        r += dx;
        c += dy;
      }
    }
    return moves;
  };
  
  // King Movement Logic (1 square in any direction)
  const getKingMoves = (piece, row, col, board) => {
    let moves = [];
    const movesList = [
      [1, 0], [-1, 0], [0, 1], [0, -1],
      [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];
  
    movesList.forEach(([dx, dy]) => {
      let r = row + dx, c = col + dy;
      if (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (!board[r][c] || board[r][c].color !== piece.color) {
          moves.push({ row: r, col: c });
        }
      }
    });
  
    return moves;
  };
  
  