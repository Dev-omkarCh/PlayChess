import React from "react";
import { useMainSocket } from "../../store/socketIoStore";
import useChessStore from "../../store/chessStore";
import useSocketStore from "../../store/socketStore";
import { useResultStore } from "../../store/resultStore";
import Button from "../Button";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import { useSocketContext } from "@/context/SocketContext";
import clearChessData from "@/utils/clearChessData";

const DrawRequestModal = () => {
  const { drawRequest, closeDrawRequest, openGameOverModal } = useChessStore();
  const socket = useSocketContext();
  const { room } = useSocketStore();
  const {setGameResult} = useResultStore();

  // if (!drawRequest) return null;

  const acceptDraw = () => {
    socket.emit("drawAccepted",room);
    setGameResult("draw", "draw");
    openGameOverModal(true);
    closeDrawRequest();
    clearChessData()
  };

  return (
    <div className="w-full h-fit bg-opacity-70 flex justify-center items-center mb-3">
      <div className="bg-secondaryVaraint text-white rounded-lg text-center w-96 p-2 items-center flex justify-between px-4">
        <h2 className="text-base font-bold">Wanna Draw?</h2>
        <div className="flex gap-3">
          <Button className={"w-fit h-fit"} color="green" text={<IoMdCheckmark className="text-lg"/>} handleOnClick={acceptDraw} />
          <Button className={"w-fit h-fit"} color="red" text={<IoMdClose className="text-lg"/>} handleOnClick={closeDrawRequest} />
        </div>
        
        
      </div>
    </div>
  );
};

export default DrawRequestModal;
