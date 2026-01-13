import ChessSettings from '@/pages/ChessSettings'
import useChessStore from '@/store/chessStore';
import { parseFEN } from '@/utils/Fen';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Flag, Handshake } from 'lucide-react'
import React, { useState } from 'react'

const Controls = () => {

    const [settings, setSettings] = useState({
        boardColor: 'green',
        pieceStyle: 'neo',
        sounds: true,
        cheatDetection: true,
        disableChat: false,
        hideElo: false,
        hideAvatar: false,
        focusMode: false,
        onlyShowBoard: false,
    });
    const { gameHistory, count, moveCount } = useChessStore();
    const [disable, setDisable] = useState({
        goFirst: false,
        goBack: false,
        goForward: false,
        goLast: false,
    });

    const handleGoToStart = () => {

        if (!gameHistory) return console.error("gameHistory is null");
        const gameState = parseFEN(gameHistory[0]?.fen);

        if (!gameState) return console.error("gameState is null");
        if (!gameState?.board) return console.error("gameState don't have any board");

        useChessStore.setState({ board: gameState.board, count: 0 });
        setDisable((prev) => ({ ...prev, goLast: false, goForward: false, goFirst: true, goBack: true }));
        return;
    };

    const handleGoBack = () => {
        const index = count - 2;

        if (!gameHistory) return console.error("gameHistory is null");
        if (count <= 1) {
            setDisable((prev) => ({ ...prev, goLast: false, goForward: false, goFirst: true, goBack: true }));
            return console.error("can't go any back");
        }

        const gameState = parseFEN(gameHistory[index]?.fen);

        if (!gameState) return console.error("gameState is null");
        if (!gameState?.board) return console.error("gameState don't have any board");

        useChessStore.setState({ board: gameState.board, count: count - 1 });

        if(count === 2) {
            setDisable((prev) => ({ ...prev, goLast: false, goForward: false, goFirst: true, goBack: true }));
            return;
        }
    };

    const handleGoForward = () => {
        const index = count + 1;

        if (!gameHistory) return console.error("gameHistory is null");
        if (count + 1 == moveCount) {
            setDisable((prev) => ({ ...prev, goLast: true, goForward: true, goFirst: false, goBack: false }));
            return console.error("can't go Forward");
        }
        const gameState = parseFEN(gameHistory[index]?.fen);

        if (!gameState) return console.error("gameState is null");
        if (!gameState?.board) return console.error("gameState don't have any board");

        useChessStore.setState({ board: gameState.board, count: count + 1 });
        if (count + 2 == moveCount) {
            setDisable((prev) => ({ ...prev, goLast: true, goForward: true, goFirst: false, goBack: false }));
            return;
        }
    };

    const handleGoToLatest = () => {
        console.log("Go To Last Move");

        if (!gameHistory) return console.error("gameHistory is null");
        const endIndex = moveCount - 1;

        const gameState = parseFEN(gameHistory[endIndex]?.fen);

        if (!gameState) return console.error("gameState is null");
        if (!gameState?.board) return console.error("gameState don't have any board");

        useChessStore.setState({ board: gameState.board, count : endIndex });
        setDisable((prev) => ({ ...prev, goLast: true, goForward: true, goFirst: false, goBack: false }));

        return;
    };

    const handleResign = () => {
        localStorage.clear();
    }

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 lg:static bg-[#211f1c] border-t border-[#3d3a35] z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.5)]">

                {/* Navigation Controls */}
                <div className="grid grid-cols-4 border-b border-[#34322d]">

                    {/* Go To First Move */}
                    <button
                        className={`p-4 flex justify-center  ${disable.goFirst ? "bg-zinc-900 text-zinc-600" : "hover:bg-[#3d3a35] text-zinc-400"}`}
                        onClick={handleGoToStart}
                        disabled={disable.goFirst}
                    ><ChevronsLeft size={24} /></button>

                    <button
                        className={`p-4 flex justify-center  ${ disable.goBack ? "bg-zinc-900 text-zinc-600" : "hover:bg-[#3d3a35] text-zinc-400"}`}
                        onClick={handleGoBack}
                        disabled={disable.goBack}
                    ><ChevronLeft size={24} /></button>

                    <button
                        className={`p-4 flex justify-center  ${count === moveCount || disable.goForward ? "bg-zinc-900 text-zinc-600" : "hover:bg-[#3d3a35] text-zinc-400"}`}
                        onClick={handleGoForward}
                        disabled={count === moveCount || disable.goForward}
                    ><ChevronRight size={24} /></button>

                    <button
                        className={`p-4 flex justify-center  ${count === moveCount || disable.goLast ? "bg-zinc-900 text-zinc-600" : "hover:bg-[#3d3a35] text-zinc-400"}`}
                        onClick={handleGoToLatest}
                        disabled={count === moveCount || disable.goLast}
                    ><ChevronsRight size={24} /></button>
                </div>

                {/* Action Buttons */}
                <div className="p-3 flex gap-2">
                    <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#3d3a35] rounded font-bold text-sm text-white active:scale-95 transition-transform">
                        <Handshake size={18} /> Draw
                    </button>
                    <button
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#3d3a35] rounded font-bold 
                    text-sm text-white active:scale-95 transition-transform"
                        onClick={handleResign}>
                        <Flag size={18} /> Resign
                    </button>
                    <ChessSettings settings={settings} setSettings={setSettings} />
                </div>
            </div>
        </>
    )
}

export default Controls
