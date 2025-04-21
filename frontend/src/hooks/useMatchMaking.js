import { useEffect } from 'react';
import { useMainSocket } from '../store/socketIoStore';
import { useNavigate } from 'react-router-dom';
import useSocketStore from './useRoom';
import { useResultStore } from '../store/resultStore';
import { useFriend } from './useFriend';

export const useMatchmaking = () => {
    const { socket } = useMainSocket();
    const navigate = useNavigate();
    const { setMatchMaked, setOpponentId } = useResultStore();
    const { setRoom, setPlayerColor } = useSocketStore();

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
            socket.off("matchFound");
        };
    }, [socket]);

    return { joinQueue };
};
