import React from "react";
import { useMainSocket } from "../../store/socketIoStore";
import useChessStore from "../../store/chessStore";
import useSocketStore from "../../store/socketStore";
import { useResultStore } from "../../store/resultStore";

const DrawRequestModal = () => {
  const { drawRequest, closeDrawRequest, openGameOverModal } = useChessStore();
  const socket = useMainSocket.getState().socket;
  const { room } = useSocketStore();
  const {setGameResult} = useResultStore();

  if (!drawRequest) return null;

  const acceptDraw = () => {
    socket.emit("drawAccepted",room);
    setGameResult("draw", "draw");
    openGameOverModal(true);
    closeDrawRequest();
  };

  return (
    <div className="w-[80%] h-fit bg-opacity-70 flex justify-center items-center">
      <div className="bg-[#1e1e2e] text-white rounded-lg text-center w-96 p-2">
        <h2 className="text-lg font-bold mb-4">Opponent Offered Draw</h2>
        <button
          onClick={acceptDraw}
          className="bg-gray-500 text-black px-6 py-2 rounded-lg mr-4 hover:bg-gray-600 "
        >
          Accept
        </button>
        <button
          onClick={closeDrawRequest}
          className="bg-red-600 px-6 py-2 rounded-lg hover:bg-red-700"
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default DrawRequestModal;
