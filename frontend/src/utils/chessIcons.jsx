import whitePawn from "../assets/pieces/wp.png";
import blackPawn from "../assets/pieces/bp.png";

import whiteRook from "../assets/pieces/wr.png";
import blackRook from "../assets/pieces/br.png";

import whiteKnight from "../assets/pieces/wn.png";
import blackKnight from "../assets/pieces/bn.png";

import whiteBishop from "../assets/pieces/wb.png";
import blackBishop from "../assets/pieces/bb.png";

import whiteQueen from "../assets/pieces/wq.png";
import blackQueen from "../assets/pieces/bq.png";

import whiteKing from "../assets/pieces/wk.png";
import blackKing from "../assets/pieces/bk.png";

const getChessIcon = (type, color) => {

  switch (type) {
    case "pawn": {
      if(color === "white") return whitePawn;
      else return blackPawn
    }
    case "rook": {
      if(color === "white") return  whiteRook;
      else return blackRook
    }
    case "knight": {
      if(color === "white") return  whiteKnight;
      else return blackKnight
    }
    case "bishop": {
      if(color === "white") return  whiteBishop;
      else return blackBishop
    }
    case "queen": {
      if(color === "white") return  whiteQueen;
      else return blackQueen
    }
    case "king": {
      if(color === "white") return  whiteKing;
      else return blackKing
    }

    default: return null;
  }
};

export default getChessIcon;

