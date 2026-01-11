import { useContext, createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import useAuthStore from "@/store/authStore";
import useFriendStore from "@/store/useFriendStore";
// import { useLocation } from "react-router-dom";
import { useOnlineStore } from "@/store/onlineStore";
import useToastStore from "@/store/toastStore";
import useChessStore from "@/store/chessStore";
import useGameExists from "@/hooks/useGameExists";
import { useResultStore } from "@/store/resultStore";

const SocketContext = createContext(null);

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { setSocketForChessStore } = useChessStore();
  const { authUser } = useAuthStore();

  // const location = useLocation();
  // const inInvitePage = location.pathname === "/friends/invite";

  const { setFriendRequests } = useFriendStore();
  const { setOnlineUsers } = useOnlineStore();
  const { showToast, setType } = useToastStore();
  const { setOpponentId } = useResultStore();

  useEffect(() => {

    // Only connect if we actually have a Logged user
    if (authUser) {
      const newSocket = io("http://localhost:4000", {
        query: {
          userId: authUser._id,
        },
      });

      setSocket(newSocket);
      setSocketForChessStore(newSocket);

      newSocket.on("online_users", (users) => {
        setOnlineUsers(users);
      });

      newSocket.on("hasfriendRequest", (data) => {
        showToast(data);
        setFriendRequests(data, true);
      });

      
      newSocket.on("hasGameRequest",(data)=>{
        showToast(data);
        setType("GAME");
        setFriendRequests(data, true);
      });

      newSocket.on("hasAccepted",({ newNotification, userId })=>{
        setOpponentId(userId);
        setFriendRequests(newNotification);
      });

      // Clean up when user logs out or component unmounts
      return () => {
        newSocket.close();
        setSocket(null);
      };

    } else {
      // If user logs out, make sure the old socket is closed
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]); // Re-run this when authUser changes!

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};