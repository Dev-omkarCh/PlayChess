import { create } from "zustand";
import { useNavigate } from "react-router-dom";
import { messageStore } from "./messageStore";

const useSocketStore = create((set, get) => ({
  room: null,
  setRoom: (room) => set({ room: room }),
  isGameStarted: false,
  playerColor: "white", // Track whether the player is White or Black
  setPlayerColor: (color) => set({ playerColor: color }),
  socket: null,
  setSocketStoreSocket: (socket) => set({ socket }),

  joinGame: (room) => {
    const { socket } = get();
    socket?.emit("joinGame", room);
    set({ room });
  },

  messageListener: () => {
    const { socket } = get();
    console.log("called");
    socket?.on("newMessage", (message) => {
      console.log("Recieved a message : ", message)
      messageStore.getState().setMessages(message, true);
    });
  },

  startGameListener: () => {

    const { socket } = get();
    const navigate = useNavigate();

    socket?.on("startGame", () => {
      console.log("start")
      set({ isGameStarted: true });
      navigate("/test");
    });


  },
}));

export default useSocketStore;