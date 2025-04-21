import useSettingStore from "../store/settingStore";
import { iconLibrary } from "./iconLibrary";

export const getPieceIcon = (piece) => {
    const { pieceType } = useSettingStore();
    switch (piece) {
        case 'P': return iconLibrary[pieceType].whitePawn;
        case 'p': return iconLibrary[pieceType].blackPawn;
        case 'R': return iconLibrary[pieceType].whiteRook;
        case 'r': return iconLibrary[pieceType].blackRook;
        case 'N': return iconLibrary[pieceType].whiteKnight;
        case 'n': return iconLibrary[pieceType].blackKnight;
        case 'B': return iconLibrary[pieceType].whiteBishop;
        case 'b': return iconLibrary[pieceType].blackBishop;
        case 'Q': return iconLibrary[pieceType].whiteQueen;
        case 'q': return iconLibrary[pieceType].blackQueen;
        case 'K': return iconLibrary[pieceType].whiteKing;
        case 'k': return iconLibrary[pieceType].blackKing;
        default: return ''; 
    }
}