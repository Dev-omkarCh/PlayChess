import React from "react";
import useChessStore from "../../store/chessStore";
import getChessIcon from "../../utils/chessIcons";

const PromotionModal = () => {
  
  const { promotePawn } = useChessStore();
  const options = ["queen", "rook", "bishop", "knight"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-center mb-4">Choose Promotion</h2>
        <div className="flex gap-4">
          {options.map((type) => (
            <button
              key={type}
              className="bg-blue-500 text-white p-2 rounded"
              onClick={() => {
                promotePawn(type)
              }}
            >
              {type?.toLocaleUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionModal;
