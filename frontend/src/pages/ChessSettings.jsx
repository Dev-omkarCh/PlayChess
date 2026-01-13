import React, { useState } from 'react';
import { 
  X, Settings, Monitor, Volume2, UserX, MessageSquareOff, 
  Palette, EyeOff, ShieldAlert, Maximize2 
} from 'lucide-react';

const ChessSettings = ({ settings, setSettings }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to toggle settings
  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="relative">
      {/* 1. THE TRIGGER (Gear Icon from previous UI) */}
      <button 
        onClick={() => setIsOpen(true)}
        className="p-3 bg-[#3d3a35] hover:bg-[#4d4a44] rounded text-white transition-colors"
      >
        <Settings size={20} />
      </button>

      {/* 2. THE MODAL OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#262421] w-full max-w-md rounded-lg shadow-2xl border border-zinc-700 overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-[#211f1c]">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings size={20} className="text-[#81b64c]" /> Settings
              </h2>
              <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white">
                <X size={24} />
              </button>
            </div>

            {/* Settings Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              
              {/* Board Theme */}
              <section>
                <label className="text-xs font-bold uppercase text-zinc-500 mb-3 block">Board & Pieces</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm block mb-2">Board Color</span>
                    <div className="flex gap-2">
                      {['green', 'blue', 'brown'].map(color => (
                        <button 
                          key={color}
                          onClick={() => setSettings(s => ({...s, boardColor: color}))}
                          className={`w-8 h-8 rounded-full border-2 ${color === 'green' ? 'bg-[#779556]' : color === 'blue' ? 'bg-[#4b7399]' : 'bg-[#b58863]'} ${settings.boardColor === color ? 'border-white' : 'border-transparent'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm block mb-2">Piece Set</span>
                    <select className="bg-[#161512] text-sm border-none rounded p-2 w-full text-white">
                      <option>Neo (Standard)</option>
                      <option>Wood</option>
                      <option>Classic</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Toggles Group 1: Audio & Safety */}
              <section className="space-y-4">
                <label className="text-xs font-bold uppercase text-zinc-500 block">General</label>
                <ToggleRow 
                  icon={<Volume2 size={18}/>} 
                  label="Enable Sounds" 
                  enabled={settings.sounds} 
                  onToggle={() => toggle('sounds')} 
                />
                <ToggleRow 
                  icon={<ShieldAlert size={18} className="text-red-500"/>} 
                  label="Cheat Protection" 
                  enabled={settings.cheatDetection} 
                  onToggle={() => toggle('cheatDetection')} 
                />
                <ToggleRow 
                  icon={<ShieldAlert size={18} className="text-red-500"/>} 
                  label="Only Board" 
                  enabled={settings.onlyShowBoard} 
                  onToggle={() => toggle('onlyShowBoard')} 
                />
              </section>

              {/* Toggles Group 2: Privacy */}
              <section className="space-y-4">
                <label className="text-xs font-bold uppercase text-zinc-500 block">Privacy & UI</label>
                <ToggleRow 
                  icon={<MessageSquareOff size={18}/>} 
                  label="Disable Chat" 
                  enabled={settings.disableChat} 
                  onToggle={() => toggle('disableChat')} 
                />
                <ToggleRow 
                  icon={<EyeOff size={18}/>} 
                  label="Hide Ratings (Elo)" 
                  enabled={settings.hideElo} 
                  onToggle={() => toggle('hideElo')} 
                />
                <ToggleRow 
                  icon={<UserX size={18}/>} 
                  label="Placeholder Avatars" 
                  enabled={settings.hideAvatar} 
                  onToggle={() => toggle('hideAvatar')} 
                />
              </section>

              {/* Desktop Only: Focus Mode */}
              <section className="pt-4 border-t border-zinc-800">
                <div className="hidden lg:block">
                  <ToggleRow 
                    icon={<Maximize2 size={18}/>} 
                    label="Focus Mode (Full Screen)" 
                    enabled={settings.focusMode} 
                    onToggle={() => toggle('focusMode')} 
                  />
                  <p className="text-[10px] text-zinc-500 mt-2">Hides sidebar and centers the board.</p>
                </div>
                {/* Mobile placeholder for the logic */}
                <div className="lg:hidden p-3 bg-zinc-900 rounded border border-dashed border-zinc-700">
                   <p className="text-xs text-zinc-500 text-center italic">Focus mode is only available on desktop browsers.</p>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="p-4 bg-[#211f1c] text-right">
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-[#81b64c] hover:bg-[#a3d16a] text-white px-6 py-2 rounded font-bold transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable Toggle Row Component
const ToggleRow = ({ icon, label, enabled, onToggle }) => (
  <div className="flex items-center justify-between group cursor-pointer" onClick={onToggle}>
    <div className="flex items-center gap-3">
      <div className="text-zinc-400 group-hover:text-white transition-colors">{icon}</div>
      <span className="text-sm text-zinc-200">{label}</span>
    </div>
    <div className={`w-10 h-5 rounded-full relative transition-colors ${enabled ? 'bg-[#81b64c]' : 'bg-zinc-700'}`}>
      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${enabled ? 'left-6' : 'left-1'}`} />
    </div>
  </div>
);

export default ChessSettings;