import { useEffect, useState } from 'react';
import ChessBoard1 from '@/components/chess/ChessBoard1';
import PlayerInfo from '@/components/chess/PlayerInfo';
import Controls from '@/components/chess/Controls';
import ChatTab from '@/components/chess/ChatTab';
import MovesTab from '@/components/chess/MovesTab';
import useChessStore from '@/store/chessStore';
import useSocketStore from '@/store/socketStore';
import useSettingStore from '@/store/settingStore';
import { useSocketContext } from '@/context/SocketContext';
import OpponentInfo from '@/components/chess/OpponentInfo';

const MultiplayerGame1 = () => {
    const [activeTab, setActiveTab] = useState('moves');
    const [timer, setTimer] = useState(0);

    const { listenForMoves, board, turn, gameHistory, notation } = useChessStore();
    const { playerColor, room } = useSocketStore();
    const { getSettings } = useSettingStore();
    const socket = useSocketContext();


    useEffect(() => {
        if (socket) {

            if (localStorage.getItem("board")) {
                console.log(`When board Exists`);

                const board = JSON.parse(localStorage.getItem("board"));
                const turn = localStorage.getItem("turn");
                const roomId = localStorage.getItem("roomId");
                const playerColor = localStorage.getItem("playerColor");
                const restoredGameHistory = JSON.parse(localStorage.getItem("gameHistory"));
                const notations = JSON.parse(localStorage.getItem("notations"));

                console.log("Restored board state", board);

                useChessStore.setState({ 
                    board, turn, 
                    moveCount : restoredGameHistory?.length, 
                    count: restoredGameHistory?.length, 
                    gameHistory : restoredGameHistory,
                    notation: notations
                });
                useSocketStore.setState({ playerColor, room: roomId });
                useSocketStore.setState({ playerColor, room: roomId });

                socket?.emit("joinGameOnReload", roomId);
                getSettings();
                return;
            }
            console.log("first Render")
            console.log("game History : ",gameHistory)

            localStorage.setItem("board", JSON.stringify(board));
            localStorage.setItem("turn", turn);
            localStorage.setItem("roomId", room);
            localStorage.setItem("playerColor", playerColor);
            localStorage.setItem("gameHistory", JSON.stringify(gameHistory));
            localStorage.setItem("notations", JSON.stringify(notation));

            getSettings();
        }

    }, [socket]);

    listenForMoves();

    return (
        <div className="flex flex-col lg:flex-row min-h-screen w-full bg-[#161512] text-[#bababa] font-sans">

            {/* BOARD AREA (Scrollable) */}
            <div className="flex-1 flex flex-col items-center p-2 lg:p-4 overflow-y-auto lg:pb-4">
                <div className="w-full max-w-[500px] lg:max-w-[80vh] flex flex-col gap-2">
                    {/* Opponent Info */}
                    <OpponentInfo timer={timer} turn={turn} />

                    {/* Board */}
                    <ChessBoard1 />

                    {/* User Info */}
                    <PlayerInfo timer={timer} isMe={true} turn={turn} />
                </div>
            </div>

            {/* SIDEBAR & FIXED CONTROLS */}
            <div className="w-full lg:w-[400px] flex flex-col bg-[#262421] lg:relative">

                {/* Tab Headers */}
                <div className="flex bg-[#211f1c] sticky top-0 z-10 lg:static">
                    <button
                        onClick={() => setActiveTab('moves')}
                        className={`flex-1 py-3 text-xs font-bold uppercase ${activeTab === 'moves' ? 'text-white border-b-2 border-[#81b64c]' : 'text-zinc-500'}`}
                    >
                        Moves
                    </button>
                    <button
                        onClick={() => setActiveTab('chat')}
                        className={`flex-1 py-3 text-xs font-bold uppercase ${activeTab === 'chat' ? 'text-white border-b-2 border-[#81b64c]' : 'text-zinc-500'}`}
                    >
                        Chat
                    </button>
                </div>

                {/* Tabs Content - On mobile, this will scroll behind the bottom bar */}
                <div className="flex-1 p-4 mb-[120px] lg:mb-0 relative">
                    {activeTab === 'moves' ? <MovesTab /> : <ChatTab />}
                </div>

                {/* FIXED BOTTOM BAR (Mobile Only) / STICKY BOTTOM (Desktop) */}
                <Controls />
            </div>
        </div>
    );
};

export default MultiplayerGame1;