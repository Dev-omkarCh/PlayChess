import React, { useEffect, useRef } from "react";

import Button from "../Button";
import useChessStore from "@/store/chessStore";
import useSocketStore from "../../store/socketStore";

import { useMainSocket } from "../../store/socketIoStore";
import clearChessData from "@/utils/clearChessData";
import { useResultStore } from "@/store/resultStore";
import { useSocketContext } from "@/context/SocketContext";


const MoveHistory = () => {

    const { notation, openGameOverModal, resetBoard, drawRequest } = useChessStore();
    const scrollRef = useRef();
    const { room } = useSocketStore();
    const socket = useSocketContext();

    const handleResign = () => {
      const setGameResult = useResultStore.getState().setGameResult;
      const room = useSocketStore.getState().room;

      openGameOverModal(true);
      setGameResult("lose", "resign");
      socket?.emit("resign", room);
      
      resetBoard();
      clearChessData();
    };

    const handleDraw = () => {
        socket.emit("drawRequest", room);
    };

  
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
      <div className="bg-primary text-white p-4 rounded-lg h-[90%] min-h-[80%] w-full shadow-lg border border-sectionBorder flex-grow">
        <h2 className="text-center text-lg font-semibold mb-3 tracking-wide">
          Move History
        </h2>
  
        <div className="max-h-[450px]" ref={scrollRef}>
          <div className=" flex justify-center items-center gap-4 mt-4 flex-col mb-3 border-t border-sectionBorder pt-5">
              <div className='flex w-full items-center gap-3 justify-evenly'>
                <Button handleOnClick={handleResign} text={"Resign"} color="red" />
                <Button handleOnClick={handleDraw} text={"Draw"} color="blue" />     
              </div>
          </div>
          <div className={`w-full`}>
            <table className=" w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#2e2e3e] text-[#aaa]">
                  <th className="text-center py-2">#</th>
                  <th className="text-center py-2">You</th>
                  <th className="text-center py-2">Opponent</th>
                </tr>
              </thead>
              <tbody className="h-10">
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
      </div>
    );
};

export default MoveHistory;
