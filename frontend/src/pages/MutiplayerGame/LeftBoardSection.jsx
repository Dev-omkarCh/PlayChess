import { useEffect } from "react";
import ChessBoard from "../../test/ChessBoard";
import PlayerProfile from "../../components/chess/PlayerProfile";

import { useResultStore } from "../../store/resultStore";
import { useFriend } from "../../hooks/useFriend";
import { useMainSocket } from "../../store/socketIoStore";
import useChessStore from "../../hooks/useChessStore";
import NavigateBack from "@/components/NavigateBack";
import { useSocketContext } from "@/context/SocketContext";

const LeftBoardSection = () => {

    const { you, opponent } = useResultStore();
    const socket = useSocketContext();
    const { getBothPlayersDetails } = useFriend();
    const { setPlayerColor, turn } = useChessStore();


    // setPlayerColor("white");
    useEffect(()=>{
        setPlayerColor("white");
        if (socket) {
            // Get Data of current User and opponent
            getBothPlayersDetails();
        }
    },[socket, turn]);

    return (
        <div className="Left w-full flex flex-col items-center justify-start p-2 relative bg-primary border-r border-sectionBorder">
            <NavigateBack path={"/menu"}/>
            <div className='player-section w-full h-[10%] flex justify-start items-center'>
                <PlayerProfile player={you} />
            </div>
            <div className="aspect-square w-full sm:w-[400px] md:w-[500px] lg:w-[500px] max-w-[700px] flex-grow">
                <ChessBoard />
            </div>
            <div className='player-section w-full h-[10%] flex justify-end items-center'>
                <PlayerProfile player={opponent} />
            </div>
        </div>
    )
};

export default LeftBoardSection;
