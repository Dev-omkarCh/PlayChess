import { create } from "zustand";

import { useMainSocket } from "./socketIoStore";
import { useNavigate } from "react-router-dom";
import { messageStore } from "./messageStore";

const useSocketStore = create((set) => ({
  room: null,
  setRoom : (room) => set({ room : room }),
  isGameStarted: false,
  playerColor: "white", // Track whether the player is White or Black
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

  messageListener : () =>{
    const socket = useMainSocket.getState().socket;
    console.log("called");
    socket?.on("newMessage", (message)=>{
      console.log("Recieved a message : ", message)
      messageStore.getState().setMessages(message,true);
    });
  },

  startGameListener: () => {

    const socket = useMainSocket.getState().socket;
    const navigate = useNavigate();

    socket?.on("startGame", () => {
      console.log("start")
      set({ isGameStarted: true });
      navigate("/test");
    });


  },
}));

export default useSocketStore;