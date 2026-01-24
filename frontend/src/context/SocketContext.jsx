import { useContext, createContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import useAuthStore from "@/store/authStore";
import useFriendStore from "@/store/useFriendStore";
// import { useLocation } from "react-router-dom";
import { useOnlineStore } from "@/store/onlineStore";
import useToastStore from "@/store/toastStore";
import useChessStore from "@/store/chessStore";
import { useResultStore } from "@/store/resultStore";
import { parseFEN } from "@/utils/Fen";
import useSocketStore from "@/store/socketStore";
import { useGameDataStore } from "@/store/gameDataStore";
import { useAppNavigator } from "@/hooks/useAppNavigator";

const SocketContext = createContext(null);

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { setSocketForChessStore, setBoard } = useChessStore();
  const { friends, setFriends } = useFriendStore();
  const { authUser } = useAuthStore();

  // const location = useLocation();
  // const inInvitePage = location.pathname === "/friends/invite";

  const { setFriendRequests, setFriend } = useFriendStore();
  const { setOnlineUsers } = useOnlineStore();
  const { showToast, setType } = useToastStore();
  const { setOpponentId } = useResultStore();
  const { setPlayerColor, setSocketStoreSocket } = useSocketStore();
  const { setGameData } = useGameDataStore();
  const { goTo } = useAppNavigator();

  useEffect(() => {

    // Only connect if we actually have a Logged user
    if (authUser) {
      const newSocket = io("http://localhost:4001", {
        query: {
          userId: authUser._id,
        },
      });

      setSocket(newSocket);
      setSocketForChessStore(newSocket);
      setSocketStoreSocket(newSocket);

      newSocket.on("online_users", (users) => {
        setOnlineUsers(users);
      });

      newSocket.on("hasfriendRequest", (data) => {
        showToast(data);
        setFriendRequests(data, true);
      });

      newSocket.on("hasAcceptRequest", ({ notification, sender }) => {

        if (notification && sender) {
          setFriend(sender);
        }
        setFriendRequests(notification);
      });

      newSocket.on("removedByfriend", (id) => {
        setFriends(friends?.filter((friend) => friend?._id !== id));
      });

      newSocket.on("statusChange", (status) => {
        setFriends(friends?.filter((friend) => friend?._id !== id));
      });

      newSocket.on("hasGameRequest", ({ notification, gameData  }) => {
        setType("GAME");
        showToast(notification);
        setGameData(gameData);
        localStorage.setItem("gameDataNew", JSON.stringify(gameData));
        setFriendRequests(notification, true);
      });

      newSocket.on("assignColor", (color) => {
        console.log("Assigned color:", color);
        localStorage.setItem("playerColor", color);
        setPlayerColor(color);
      });

      newSocket.on("hasAccepted", ({ newNotification, userId }) => {
        setOpponentId(userId);
        setFriendRequests(newNotification);
        goTo("/game/lobby");
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