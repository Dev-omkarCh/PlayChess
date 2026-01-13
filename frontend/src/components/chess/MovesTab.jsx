import useChessStore from '@/store/chessStore'
import React from 'react'

const MovesTab = () => {
    const {notation} = useChessStore();
    const getMove = (move) => (move ? move : "-");
    
    const isLastMove = (index, player) => {

        return index === notation[player].length - 1 
        && notation[player].length !== 0;
    };
      
    return (
        <>
            <div className="space-y-1">
                {/* {[1, 2, 3, 4, 5].map(n => (
                    <div key={n} className="grid grid-cols-3 text-sm p-1 odd:bg-[#2b2925]">
                        <span className="text-zinc-500">{n}.</span>
                        <span className="text-white">e4</span>
                        <span className="text-white">e5</span>
                    </div>
                ))} */}
                {notation?.you?.map((move, index) => (
                    <div key={index} className="grid grid-cols-3 text-sm p-1 odd:bg-[#2b2925] border-b border-[#2e2e3e]">
                        <span className="text-zinc-500">{index + 1}.</span>
                        <span className={isLastMove(index, "you") ? "" : `text-white`}>{getMove(move)}</span>
                        <span className={isLastMove(index, "opponent") ? "" : `text-white`}>{getMove(notation?.opponent[index])}</span>
                    </div>
                ))}
            </div>
        </>
    )
}

export default MovesTab
