import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdVolumeUp, MdVolumeOff } from "react-icons/md";
import useSettingStore from "../store/settingStore";
import whitePawn from "../assets/pieces/wp.png";
import { getPieceIcon } from "../utils/getPieceIcon";
import { useNavigate } from "react-router-dom";
const boardThemes = [
  { name: "brown", blackTile: "#b88762", whiteTile: "#edd6b0" },
  { name: "green", blackTile: "#739552", whiteTile: "#ebecd0" },
  { name: "black & white", blackTile: "#282f3b", whiteTile: "#dfe2e9" },
  { name: "purple", blackTile: "#8476ba", whiteTile: "#f0f1f0" },

];

const pieceStyles = [
  "classic",
  "wooden",
  "neo",
];

const SettingsModal = () => {

  const { sound, setSound, boardColor, setBoardColor, pieceType, setPieceType, settingsModal, openSettingsModal } = useSettingStore();
  const { getSettings, setSettings } = useSettingStore();
  const navigate = useNavigate();

  useEffect(() => {
    getSettings();
  }, [])

  const handleSave = () => {
    console.log(sound, pieceType, boardColor)
    setSettings(sound, pieceType, boardColor);
  };

  const initialBoard = [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"],
  ];

  return (
    <div className="fixed inset-0 bg-primary bg-opacity-50 flex items-center justify-center h-dvh w-dvw">
      <div className="bg-secondary text-white p-6 rounded-2xl w-96 shadow-lg relative z-50">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button 
            className="text-gray-300 hover:text-white"
            onClick={()=> navigate("/menu")}
            >
            <IoMdClose size={22} />
          </button>
        </div>

        {/* Sound Toggle */}
        <div className="flex justify-between items-center p-3 rounded-lg bg-secondaryVaraint hover:bg-secondaryVaraintHover cursor-pointer">
          <div className="flex items-center gap-2">
            {sound ? <MdVolumeUp size={20} /> : <MdVolumeOff size={20} />}
            <span>Sound</span>
          </div>
          <button
            className={`w-12 h-6 flex items-center rounded-full p-1 ${sound ? "bg-green-500" : "bg-gray-600"
              }`}
            onClick={() => {
              setSound(!sound);
            }}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full transform transition ${sound ? "translate-x-6" : ""
                }`}
            />
          </button>
        </div>

        {/* Board Color Dropdown */}
        <div className="mt-4">
          <label className="block text-sm mb-1">Board Color</label>
          <select
            className="w-full bg-secondaryVaraint hover:bg-secondaryVaraintHover p-2 rounded-lg"
            value={boardColor.name}
            onChange={(e) => {
              setBoardColor(boardThemes.find((t) => t.name.toLocaleLowerCase() === e.target.value.toLocaleLowerCase()));
            }
            }
          >
            {boardThemes.map((theme) => (
              <option key={theme.name} value={theme.name}>
                {theme.name}
              </option>
            ))}
          </select>
        </div>

        {/* Board Pieces Dropdown */}
        <div className="mt-4">
          <label className="block text-sm mb-1">Board Pieces</label>
          <select
            className="w-full bg-secondaryVaraint hover:bg-secondaryVaraintHover p-2 rounded-lg"
            value={pieceType}
            onChange={(e) =>
              setPieceType(pieceStyles.find((p) => p === e.target.value))
            }
          >
            {pieceStyles.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>

        {/* Chess Board Preview */}
        <div className="mt-4">
          <label className="block text-sm mb-1">Board Preview</label>
          <div
            className={`w-full aspect-square grid grid-cols-8 grid-rows-8 border-4 border-gray-700 rounded-lg overflow-hidden`}
          >
            {initialBoard.map((row, rowIndex) =>
              row.map((piece, colIndex) => {
                const isDark = (rowIndex + colIndex) % 2 === 1;
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className="flex items-center justify-center"
                    style={
                      {
                        backgroundColor: isDark ? boardColor.blackTile : boardColor.whiteTile,
                      }
                    }
                  >
                    <div 
                    className="piece"
                    style={{
                      backgroundImage : `url(${getPieceIcon(piece)})`,
                      height: "90%",
                      width: "90%",
                      backgroundSize : "cover" }} >
                        
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Save Changes Button */}
        <button
          onClick={handleSave}
          className="mt-5 w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-semibold"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
