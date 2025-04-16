import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdVolumeUp, MdVolumeOff } from "react-icons/md";
import { FaChessBoard } from "react-icons/fa";
import useSettingStore from "../store/settingStore";

const boardThemes = [
  { name: "Blue", color: "bg-blue-500" },
  { name: "Green", color: "bg-green-500" },
  { name: "Brown", color: "bg-yellow-700" },
  { name: "Gray", color: "bg-gray-500" },
];

const pieceStyles = [
  { name: "Classic", value: "classic" },
  { name: "Wooden", value: "wooden" },
];

const SettingsModal = ({ isOpen=true, onClose, onSave }) => {

  const { sound, setSound, boardColor, setBoardColor, pieceType, setPieceType, settingsModal, openSettingsModal } = useSettingStore();

  // const [sound, setSound] = useState(settings.sound);
  // const [boardColor, setBoardColor] = useState(settings.boardColor);
  // const [pieceStyle, setPieceStyle] = useState(settings.pieceStyle);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ sound, boardColor, pieceType });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-900 text-white p-6 rounded-2xl w-96 shadow-lg relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            <IoMdClose size={22} />
          </button>
        </div>

        {/* Sound Toggle */}
        <div className="flex justify-between items-center p-3 rounded-lg bg-gray-800 hover:bg-gray-700 cursor-pointer">
          <div className="flex items-center gap-2">
            {sound ? <MdVolumeUp size={20} /> : <MdVolumeOff size={20} />}
            <span>Sound</span>
          </div>
          <button
            className={`w-12 h-6 flex items-center rounded-full p-1 ${
              sound ? "bg-green-500" : "bg-gray-600"
            }`}
            onClick={() => setSound(!sound)}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full transform transition ${
                sound ? "translate-x-6" : ""
              }`}
            />
          </button>
        </div>

        {/* Board Color Dropdown */}
        <div className="mt-4">
          <label className="block text-sm mb-1">Board Color</label>
          <select
            className="w-full bg-gray-800 p-2 rounded-lg"
            value={boardColor.name}
            onChange={(e) =>
              setBoardColor(boardThemes.find((t) => t.name.toLocaleLowerCase() === e.target.value.toLocaleLowerCase()))
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
            className="w-full bg-gray-800 p-2 rounded-lg"
            value={pieceType}
            onChange={(e) =>
              setPieceType(pieceStyles.find((p) => p.name === e.target.value))
            }
          >
            {pieceStyles.map((style) => (
              <option key={style.name} value={style.name}>
                {style.name}
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
            {[...Array(64)].map((_, i) => (
              <div
                key={i}
                className={`w-full h-full ${
                  (Math.floor(i / 8) + (i % 8)) % 2 === 0
                    ? `${boardColor.black}`
                    : `${boardColor.white}`
                }`}
              />
            ))}
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
