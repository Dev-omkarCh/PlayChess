import { FaChessPawn, FaChessRook, FaChessKnight, FaChessBishop, FaChessQueen, FaChessKing } from "react-icons/fa";

const getChessIcon = (type, color) => {
  const iconProps = { className: `text-3xl ${color === "white" ? "text-white" : "text-black"}` };

  switch (type) {
    case "pawn": return <FaChessPawn {...iconProps} />;
    case "rook": return <FaChessRook {...iconProps} />;
    case "knight": return <FaChessKnight {...iconProps} />;
    case "bishop": return <FaChessBishop {...iconProps} />;
    case "queen": return <FaChessQueen {...iconProps} />;
    case "king": return <FaChessKing {...iconProps} />;
    default: return null;
  }
};

export default getChessIcon;
