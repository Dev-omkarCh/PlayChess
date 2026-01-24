import React from 'react';
import { AlertTriangle, LogOut, X } from 'lucide-react';

const ExitConfirmModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#262421] w-full max-w-sm rounded-2xl border border-red-900/20 shadow-2xl overflow-hidden animate-in zoom-in duration-300"
      >
        {/* Warning Header */}
        <div className="bg-red-500/10 p-6 flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center text-red-500">
            <AlertTriangle size={28} />
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">Leave Lobby?</h2>
          <p className="text-sm text-gray-400">
            You will lose your spot in the match. Are you sure you want to exit?
          </p>
        </div>

        {/* Actions */}
        <div className="p-4 flex flex-col gap-2">
          <button
            onClick={onConfirm}
            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-600/10"
          >
            <LogOut size={18} /> Yes, Exit Match
          </button>
          
          <button
            onClick={onCancel}
            className="w-full py-3 bg-[#312e2b] hover:bg-[#3d3a37] text-gray-300 rounded-xl font-bold transition-all"
          >
            Stay in Lobby
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExitConfirmModal;