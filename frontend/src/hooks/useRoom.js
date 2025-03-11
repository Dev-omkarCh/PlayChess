import { useMainSocket } from "../store/socketIoStore";
import useSocketStore from "../store/socketStore";

export const useRoom = () => {
   const { socket } = useMainSocket();
   const { setRoom, setPlayerColor } = useSocketStore();
   const joinGame = (room) => {
        
        socket?.emit("joinGame", room);
        setRoom(room);

        socket?.on("assignColor", (color) => {
        console.log("Assigned color:", color);
        setPlayerColor(color);
        });
    }

    return { joinGame };

};

export default useSocketStore;