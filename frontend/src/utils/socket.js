// import { io } from "socket.io-client";
// import useAuth from "../store/useAuth";

// let socket = null;

// export const getSocket = () => {

//     if (!socket) {
//         const authUser = useAuth.getState().getAuthUser(); 
//         socket = io("http://localhost:4000", {
//         withCredentials: true,
//         query : {
//             userId : authUser?._id
//         }
//         });

//         socket.on("connect", () => {
//             console.log("🔌 Socket Connected");
//         });

//         socket.on("disconnect", () => {
        
//         socket = null; // Reset socket if disconnected
//         });
//     }
//     return socket;
// };
