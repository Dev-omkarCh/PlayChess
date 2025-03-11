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
    <div ref={drag} className={`z-10 cursor-grab ${isDragging ? " cursor-grabbing" : ""} `}
    style={{
      backgroundImage : `url(${getChessIcon(piece.type, piece.color)})`,
      height: "80%",
      width: "80%",
      backgroundSize : "cover" }} >
        
    </div>
  );
};

export default ChessPiece;
