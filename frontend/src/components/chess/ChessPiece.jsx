import { useDrag } from "react-dnd";
import getChessIcon from "../../utils/chessIcons";

const ChessPiece = ({ piece, position }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "piece",
    item: { position },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} className={`cursor-pointer ${isDragging ? "opacity-50" : ""}`}>
      {getChessIcon(piece.type, piece.color)}
    </div>
  );
};

export default ChessPiece;
