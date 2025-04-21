import useSettingStore from './../store/settingStore';
import { iconLibrary } from "./iconLibrary";


const getChessIcon = (type, color) => {

  const { pieceType } = useSettingStore();

  switch (type) {
    case "pawn": {
      if(color === "white") return iconLibrary[pieceType].whitePawn
      else return iconLibrary[pieceType].blackPawn
    }
    case "rook": {
      if(color === "white") return  iconLibrary[pieceType].whiteRook
      else return iconLibrary[pieceType].blackRook
    }
    case "knight": {
      if(color === "white") return iconLibrary[pieceType].whiteKnight
      else return iconLibrary[pieceType].blackKnight
    }
    case "bishop": {
      if(color === "white") return iconLibrary[pieceType].whiteBishop
      else return iconLibrary[pieceType].blackBishop
    }
    case "queen": {
      if(color === "white") return iconLibrary[pieceType].whiteQueen
      else return iconLibrary[pieceType].blackQueen
    }
    case "king": {
      if(color === "white") return iconLibrary[pieceType].whiteKing
      else return iconLibrary[pieceType].blackKing
    }

    default: return null;
  }
};

export default getChessIcon;

