import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { FaChessBoard, FaBrain, FaLaughBeam } from "react-icons/fa";

export default function PuzzlePage() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 ">
      {/* Open Button */}
      <button
        className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-bold shadow-[0_4px_0_#357a38] hover:bg-green-600 active:translate-y-1 active:shadow-none transition-all"
        onClick={() => setIsVisible(true)}
      >
        Open Card
      </button>

      {/* Modal Overlay */}
      {isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center transition-opacity duration-300">
          {/* Modal Card */}
          <div className="bg-[#1e1e1e] text-white w-[95%] max-w-md p-8 rounded-xl shadow-lg relative transform scale-100 opacity-100 transition-all duration-300">
            {/* Close Button */}
            <button
              className="absolute top-5 right-5 text-gray-400 hover:text-white"
              onClick={() => setIsVisible(false)}
            >
              <MdClose size={24} />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center">Puzzles</h2>

            {/* Subtitle */}
            <p className="text-gray-300 text-center mt-3 text-lg">
              Learn from interactive lessons created by chess masters.
            </p>

            {/* Puzzle Icon */}
            <div className="flex justify-center my-5">
              
            </div>

            {/* Features List */}
            <ul className="text-gray-400 space-y-3 text-lg">
              <li className="flex items-center gap-3">
                <FaChessBoard className="text-green-400" size={22} />
                Solve puzzles to improve your chess tactics
              </li>
              <li className="flex items-center gap-3">
                <FaBrain className="text-blue-400" size={22} />
                Improve pattern recognition and awareness
              </li>
              <li className="flex items-center gap-3">
                <FaLaughBeam className="text-yellow-400" size={22} />
                Have fun learning as you solve 500K+ puzzles
              </li>
            </ul>

            {/* OK Button */}
            <button
              className="bg-green-500 w-full mt-6 py-3 rounded-lg text-lg font-bold shadow-[0_4px_0_#357a38] hover:bg-green-600 active:translate-y-1 active:shadow-none transition-all"
              onClick={() => setIsVisible(false)}
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
