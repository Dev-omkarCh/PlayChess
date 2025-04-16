import React, { useEffect, useRef } from "react";
import useChessStore from "../../store/chessStore";

const MoveHistory = () => {
    const { notation, turn, playerColor } = useChessStore();
    const scrollRef = useRef();
  
    // Automatically scroll to the latest move
    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, [notation]);
  
    const getMove = (move) => (move ? move : "-");
  
    const isLastMove = (index, player) =>
      index === notation[player].length - 1 && notation[player].length !== 0;
  
    return (
      <div className="bg-[#1e1e2e] text-white p-4 rounded-lg h-[90%] min-h-[80%] w-full shadow-lg">
        <h2 className="text-center text-lg font-semibold mb-3 tracking-wide">
          Move History
        </h2>
  
        <div className="overflow-y-auto max-h-[450px]" ref={scrollRef}>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#2e2e3e] text-[#aaa]">
                <th className="text-center py-2">#</th>
                <th className="text-center py-2">You</th>
                <th className="text-center py-2">Opponent</th>
              </tr>
            </thead>
            <tbody>
              {notation?.you.map((move, index) => (
                <tr key={index} className="border-b border-[#2e2e3e]">
                  <td className="text-center py-2">{index + 1}.</td>
  
                  {/* Your Move */}
                  <td
                    className={`text-center ${
                      isLastMove(index, "you")
                        ? " h-fit w-fit text-white font-extrabold rounded-lg"
                        : ""
                    }`}
                  >
                    {getMove(move)}
                  </td>
  
                  {/* Opponent Move */}
                  <td
                    className={`text-center py-2 ${
                      isLastMove(index, "opponent")
                        ? " text-white font-bold rounded-lg"
                        : ""
                    }`}
                  >
                    {getMove(notation.opponent[index])}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
};

export default MoveHistory;
