import { useEffect } from 'react';
import useSocketStore from './useRoom';
import { useResultStore } from '../store/resultStore';
import { useSocketContext } from '@/context/SocketContext';

export const useMatchmaking = () => {
    const socket = useSocketContext();
    const { setOpponentId } = useResultStore();
    const { setRoom, setPlayerColor, playerColor } = useSocketStore();

    const joinQueue = () => {
        socket.emit("joinQueue");
    };

    useEffect(() => {
        socket?.on("matchFound", ({ roomId, color, opponentId }) => {
            console.log(`Matched! Room ID: ${roomId}, Your Color: ${color}, OpponentId: ${opponentId}`);
            if(opponentId) setOpponentId(opponentId)
            setPlayerColor(color);
            setRoom(roomId);
            localStorage.setItem("roomId",roomId);
        });

        return () => {
            socket?.off("matchFound");
        };
    }, [socket, playerColor]);

    return { joinQueue };
};
