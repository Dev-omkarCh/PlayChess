// import { useEffect } from 'react';
// import { useMainSocket } from '../store/socketIoStore';
// import { useNavigate } from 'react-router-dom';
// import useSocketStore from './useRoom';
// import { useResultStore } from '../store/resultStore';

// export const useMatchmaking = () => {
//     const { socket } = useMainSocket();
//     const navigate = useNavigate();
//     const { setPlayerColor } = useSocketStore();
//     const { setMatchMaked } = useResultStore();

//     const joinQueue = () => {
//         socket.emit("joinQueue");
//     };

//     useEffect(() => {
//         socket?.on("assignColor", (color) => {
//             console.log("Assigned color:", color);
//             setPlayerColor(color);
//         });

//         socket?.on("matchFound", ({ roomId, color }) => {
//             console.log(`Matched! Room ID: ${roomId}, Your Color: ${color}`);
//             setMatchMaked(true);
//             navigate("/multiplayer");
//         });

//         return () => {
//             socket.off("matchFound");
//         };
//     }, [socket]);

//     return { joinQueue };
// };
