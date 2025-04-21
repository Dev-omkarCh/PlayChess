import { create } from "zustand";

import { useMainSocket } from "./socketIoStore";
import { useNavigate } from "react-router-dom";

const useSocketStore = create((set) => ({
  room: null,
  setRoom : (room) => set({ room : room }),
  isGameStarted: false,
  playerColor: null, // Track whether the player is White or Black
  setPlayerColor : (color) => set({ playerColor : color }),

  joinGame: (room) => {
    const socket = useMainSocket.getState().socket;
    socket?.emit("joinGame", room);
    set({ room });

    socket?.on("assignColor", (color) => {
      console.log("Assigned color:", color);
      set({ playerColor: color });
    });
  },

  getPlayerColor : (color) =>{
    
  },

  startGameListener: () => {

    const socket = useMainSocket.getState().socket;
    const navigate = useNavigate();

    socket?.on("startGame", () => {
      console.log("start")
      set({ isGameStarted: true });
      navigate("/multiplayer");
    });
  },
}));

export default useSocketStore;