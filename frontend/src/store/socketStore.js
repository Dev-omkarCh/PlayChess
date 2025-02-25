import { create } from "zustand";
import { io } from "socket.io-client";
import { useSocket } from "../hooks/useSocket";

// const socket = io("http://localhost:4000");
const socket = useSocket();

const useSocketStore = create((set) => ({
  socket,
  room: null,
  isGameStarted: false,
  playerColor: null, // Track whether the player is White or Black

  joinGame: (room) => {
    socket.emit("joinGame", room);
    set({ room });

    socket.on("assignColor", (color) => {
      console.log("Assigned color:", color);
      set({ playerColor: color });
    });
  },

  startGameListener: () => {
    socket.on("startGame", () => {
      set({ isGameStarted: true });
    });
  },
}));

export default useSocketStore;