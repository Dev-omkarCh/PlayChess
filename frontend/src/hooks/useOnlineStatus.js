import { useEffect } from "react";
// import { io } from "socket.io-client";
import { useOnlineStore } from "../store/onlineStore.js";
// import { useSocket } from "./useSocket.js";

// TODO : Using this io() again, can cause multiple connections, so we need to check if the socket is already connected(-_-)
// const socket = io("http://localhost:4000");

// const socket = useSocket();

// export function useOnlineStatus(id) {
//   const setOnlineUsers = useOnlineStore((state) => state.setOnlineUsers);

//   useEffect(() => {
//     if (!id) return; // Prevent running without a id

//     socket.emit("user_online", id); // Notify backend
    
//     socket.on("update_users", (users) => {
//         console.log(users);
//         setOnlineUsers(users); 
//     });

//     return () => {
//       socket.disconnect(); // Clean up on unmount
//     };
//   }, [id]);
// }
