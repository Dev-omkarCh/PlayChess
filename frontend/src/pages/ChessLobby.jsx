import React, { useEffect, useState } from 'react';
import { Shield, Zap, Swords, User, CheckCircle, XCircle, Palette, Lock, Check } from 'lucide-react';
import SettingsModal from '@/components/Settings';
import ExitConfirmModal from '@/components/lobby/ExitConfirmModal';
import useAuthStore from '@/store/authStore';
import { useResultStore } from '@/store/resultStore';
import { useOnlineStore } from '@/store/onlineStore';
import { useSocketContext } from '@/context/SocketContext';
import { useGameDataStore } from '@/store/gameDataStore';
import { useFriend } from '@/hooks/useFriend';

const GameLobby = () => {

    const { onlineUsers } = useOnlineStore();
    const { authUser } = useAuthStore();
    const { opponent, setOpponent, opponentId } = useResultStore();

    const [isReady, setIsReady] = useState(true);

    console.log(opponentId);
    const opponentReady = onlineUsers?.includes(opponentId);
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState("casual");

    const [showExitConfirm, setShowExitConfirm] = useState(false);

    const { gameData, setGameData } = useGameDataStore();

    const isHost = gameData?.isHost === true;
    const opponentName = "Grandmaster_Pro";
    const userAvatar = authUser?.profileImg;
    const opponentAvatar = opponent?.profileImg;
    const socket = useSocketContext();
    const { getBothPlayersDetail } = useFriend();

    useEffect(()=>{
        console.log(onlineUsers);
        if(localStorage.getItem("gameDataNew")){
            const data = JSON.parse(localStorage.getItem("gameDataNew"));
            setGameData(data);

            console.log(data?.black);
            if(data?.isHost === true){
                getBothPlayersDetail(data?.black);
            }
            else{
                getBothPlayersDetail(data?.white);
            }
        }
        else{
            getBothPlayersDetail(opponentId);
        }
    },[]);

    const handleActualExit = () => {
        
    };

    const handleStartGame  = () => {
        if(isReady){
            socket?.emit("readyStatus", { status : false, opponentId : opponent?._id});
        }
        setIsReady(!isReady);
    };

    return (
        <div className="min-h-screen bg-[#161512] text-[#bababa] p-4 flex flex-col items-center justify-center font-sans">
            <div className="w-full max-w-2xl bg-[#262421] rounded-2xl border border-[#312e2b] shadow-2xl overflow-hidden">

                {/* MATCHMAKING AREA */}
                <div className="p-6 sm:p-10 border-b border-[#312e2b] bg-[#2a2825]">
                    <div className="flex items-center justify-between gap-4 max-w-md mx-auto">

                        {/* Player One */}
                        <div className="flex flex-col items-center flex-1">
                            <div className={`relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl transition-all duration-500 p-1 ${isReady ? 'ring-4 ring-[#81b64c] ring-offset-4 ring-offset-[#262421]' : 'bg-[#1b1a17]'}`}>
                                <div className="w-full h-full bg-[#312e2b] rounded-xl overflow-hidden flex items-center justify-center">
                                    {userAvatar ? (
                                        <img src={userAvatar} alt="You" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={40} className="text-gray-600" />
                                    )}
                                </div>
                                {isReady && (
                                    <div className="absolute -bottom-2 -right-2 bg-[#81b64c] text-white p-1 rounded-lg shadow-lg animate-bounce">
                                        <Check size={18} strokeWidth={4} />
                                    </div>
                                )}
                            </div>
                            <span className="mt-4 text-white font-black text-xs sm:text-sm uppercase tracking-tight">You</span>
                        </div>

                        <div className="flex flex-col items-center opacity-30">
                            <Swords size={28} />
                            <span className="text-[10px] font-bold italic">VS</span>
                        </div>

                        {/* Opponent */}
                        <div className="flex flex-col items-center flex-1">
                            <div className={`relative w-20 h-20 sm:w-28 sm:h-28 rounded-2xl transition-all duration-500 p-1 ${opponentReady ? 'ring-4 ring-[#81b64c] ring-offset-4 ring-offset-[#262421]' : 'bg-[#1b1a17]'}`}>
                                <div className="w-full h-full bg-[#312e2b] rounded-xl overflow-hidden flex items-center justify-center">
                                    {opponentAvatar ? (
                                        <img src={opponentAvatar} alt="Opponent" className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={40} className="text-[#81b64c]" />
                                    )}
                                </div>
                                {opponentReady && (
                                    <div className="absolute -bottom-2 -right-2 bg-[#81b64c] text-white p-1 rounded-lg shadow-lg">
                                        <Check size={18} strokeWidth={4} />
                                    </div>
                                )}
                            </div>
                            <span className="mt-4 text-white font-black text-xs sm:text-sm uppercase truncate w-24 text-center">{opponentName}</span>
                        </div>
                    </div>
                </div>

                {/* SETTINGS AREA */}
                <div className="p-6 space-y-6">
                    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${!isHost ? 'opacity-40 pointer-events-none' : ''}`}>

                        {/* Time Control - DISABLED CURSOR */}
                        <div className="space-y-2 relative group cursor-not-allowed">
                            <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-2">
                                <Zap size={14} /> Time Control
                            </label>
                            <div className="relative">
                                <div className="w-full bg-[#1b1a17] border border-[#312e2b] p-3 rounded-lg text-gray-600 text-sm font-bold flex justify-between items-center opacity-60">
                                    <span>10 min | Rapid</span>
                                    <Lock size={14} />
                                </div>
                                {/* Tooltip on hover */}
                                <div className="absolute -top-8 left-0 bg-yellow-600 text-white text-[9px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-bold">
                                    UNDER DEVELOPMENT
                                </div>
                            </div>
                        </div>

                        {/* Mode */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-2">
                                <Shield size={14} /> Mode
                            </label>
                            <div className="flex bg-[#1b1a17] p-1 rounded-lg border border-[#312e2b]">
                                <button
                                    onClick={() => setMode("ranked")}
                                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${mode === "ranked" ? "bg-[#454341] text-white" : "text-gray-500"}`}
                                >Rated</button>
                                <button
                                    onClick={() => setMode("casual")}
                                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${mode === "casual" ? "bg-[#454341] text-white" : "text-gray-500"}`}
                                >Casual</button>
                            </div>
                        </div>
                    </div>

                    {/* CUSTOMIZE BUTTON - Moved here for Mobile Visibility */}
                    <button
                        onClick={() => setIsOpen(true)}
                        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-400 transition-all group"
                    >
                        <Palette size={18} className="group-hover:rotate-12 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest">Board & Piece Settings</span>
                    </button>

                    {/* MAIN ACTIONS */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                            onClick={handleStartGame}
                            className={`flex-[2] py-4 rounded-xl font-black text-lg uppercase tracking-wider transition-all shadow-xl ${isReady
                                    ? 'bg-[#312e2b] text-gray-500'
                                    : 'bg-[#81b64c] hover:bg-[#95bb4a] text-white active:scale-[0.98]'
                                }`}
                        >
                            {isReady ? 'Waiting...' : isHost ? 'Start' : 'Ready'}
                        </button>
                        <button
                            className="flex-1 py-4 border border-red-900/30 text-red-500 rounded-xl font-bold 
                            text-sm flex items-center justify-center gap-2 hover:bg-red-500/5 transition-colors"
                            onClick={() => setShowExitConfirm(true)}
                        >
                            <XCircle size={18} /> Exit
                        </button>
                    </div>
                </div>
            </div>
            {/* PERSONAL SETTINGS */}
            {isOpen && <SettingsModal isOpen={isOpen} setIsOpen={setIsOpen} />}

            {/* THE MODAL COMPONENT */}
            <ExitConfirmModal
                isOpen={showExitConfirm}
                onConfirm={handleActualExit}
                onCancel={() => setShowExitConfirm(false)}
            />
        </div>
    );
};

export default GameLobby;