import React, { useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { MdVolumeUp, MdVolumeOff } from 'react-icons/md';
import { Save, Palette, Box, Music, Settings, Check } from 'lucide-react';
import useSettingStore from "../store/settingStore";
import { getPieceIcon } from "../utils/getPieceIcon";

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

const SettingsModal = ({ isOpen, setIsOpen }) => {
  const { 
    sound, setSound, boardColor, setBoardColor, 
    pieceType, setPieceType, getSettings, setSettings 
  } = useSettingStore();

  useEffect(() => {
    getSettings();
  }, []);

  const handleSave = () => {
    setSettings(sound, pieceType, boardColor);
    setIsOpen(false);
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#262421] text-[#bababa] w-full max-w-[440px] rounded-2xl shadow-2xl border border-[#312e2b] flex flex-col max-h-[98vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-[#312e2b]">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings size={20} className="text-indigo-400" /> Customize Board
          </h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
            <IoMdClose size={26} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
          
          {/* BIG PREVIEW */}
          <div className="relative w-full aspect-square mx-auto shadow-2xl rounded-md overflow-hidden border-4 border-[#312e2b]">
            <div className="grid grid-cols-8 w-full h-full bg-[#1b1a17]">
              {initialBoard.map((row, rowIndex) =>
                row.map((piece, colIndex) => {
                  const isDark = (rowIndex + colIndex) % 2 === 1;
                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className="flex items-center justify-center transition-colors duration-300"
                      style={{ backgroundColor: isDark ? boardColor.blackTile : boardColor.whiteTile }}
                    >
                      {piece && (
                        <div 
                          className="w-[90%] h-[90%] bg-contain bg-center bg-no-repeat drop-shadow-md"
                          style={{ backgroundImage: `url(${getPieceIcon(piece, pieceType)})` }}
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* CUSTOM SELECTORS */}
          <div className="space-y-6">
            
            {/* Board Theme Grid */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Palette size={14} /> Board Theme
              </label>
              <div className="grid grid-cols-2 gap-2">
                {boardThemes.map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => setBoardColor(theme)}
                    className={`flex items-center gap-3 p-2 rounded-lg border-2 transition-all ${
                      boardColor.name === theme.name 
                      ? 'border-indigo-500 bg-indigo-500/10' 
                      : 'border-[#312e2b] bg-[#1b1a17] hover:bg-[#2a2825]'
                    }`}
                  >
                    <div className="w-8 h-8 rounded overflow-hidden grid grid-cols-2 shrink-0 border border-white/10">
                      <div style={{ backgroundColor: theme.whiteTile }} />
                      <div style={{ backgroundColor: theme.blackTile }} />
                      <div style={{ backgroundColor: theme.blackTile }} />
                      <div style={{ backgroundColor: theme.whiteTile }} />
                    </div>
                    <span className={`text-xs font-bold capitalize ${boardColor.name === theme.name ? 'text-white' : 'text-gray-400'}`}>
                      {theme.name}
                    </span>
                    {boardColor.name === theme.name && <Check size={14} className="ml-auto text-indigo-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Piece Style Selector */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Box size={14} /> Piece Style
              </label>
              <div className="flex bg-[#1b1a17] p-1 rounded-xl border border-[#312e2b]">
                {pieceStyles.map((style) => (
                  <button
                    key={style}
                    onClick={() => setPieceType(style)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all capitalize ${
                      pieceType === style 
                      ? 'bg-[#454341] text-white shadow-lg' 
                      : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound Toggle - Sleek Style */}
            <div 
              onClick={() => setSound(!sound)}
              className="flex justify-between items-center p-4 rounded-xl bg-[#1b1a17] border border-[#312e2b] cursor-pointer hover:bg-[#201f1c] transition-all"
            >
              <div className="flex items-center gap-3">
                {sound ? <MdVolumeUp size={22} className="text-[#81b64c]" /> : <MdVolumeOff size={22} className="text-gray-600" />}
                <span className="text-sm font-bold text-white tracking-wide">Audio Effects</span>
              </div>
              <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${sound ? 'bg-[#81b64c]' : 'bg-[#312e2b]'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${sound ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-[#312e2b]">
          <button
            onClick={handleSave}
            className="w-full bg-[#81b64c] hover:bg-[#95bb4a] text-white py-4 rounded-xl font-black text-lg uppercase tracking-tighter shadow-xl active:scale-[0.97] transition-all"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;