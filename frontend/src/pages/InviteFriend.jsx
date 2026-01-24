import { useEffect, useState } from "react";

import SearchedFriend from "../components/InvitePage/SearchedFriend";
import SideBar from "../components/InvitePage/SideBar";
import TopMenu from "../components/InvitePage/TopMenu";
import Inbox from "../components/InvitePage/Inbox";
import useSeachedUsers from "../store/searchStore";
import useFriendStore from "../store/useFriendStore";

import { useResponsiveStore } from "../store/responsiveStore";
import { useAppNavigator } from "@/hooks/useAppNavigator";
import { useSocketContext } from "@/context/SocketContext";
import useRequest from "@/hooks/useRequest";
import useGame from "@/hooks/useGame";


export default function FriendsSidebar() {

  const { getFriendAndGameRequests } = useRequest();
  const { searchUsers } = useSeachedUsers();
  const { users } = useFriendStore();
  const { width, setWidth } = useResponsiveStore();
  const { WIDTH } = useResponsiveStore();
  const [isOpen, setIsOpen] = useState(true);
  const socket = useSocketContext();
  const { replaceWith } = useAppNavigator();
  const { createNewGame } = useGame();

  useEffect(() => {
    if (!socket) return;

    const handleStartGame = () => {
      console.log("Game Started 🚀🥳");
      localStorage.setItem("isGameActive", "true");

      // Don't Allow users to go back to invite page during game
      replaceWith("/game/multiplayer");
    };

    socket.on("startGame", handleStartGame);
    createNewGame();
    return () => socket?.off("startGame");
    
  }, [socket, replaceWith]);

  const handleResize = () => {
    if (width > 700 && !isOpen) {
      console.log("yes")
      setIsOpen(true);
    }
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    getFriendAndGameRequests();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);

  }, []);


  return (
    <div className="h-[100dvh] w-[100dvw] flex bg-primary">
      <SideBar width={width} isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className={`h-full ${width < WIDTH ? "w-full" : "w-[80%]"} flex flex-col`}>
        <TopMenu width={width} setIsOpen={setIsOpen} />
        <div
          className={`h-[80%] grid ${width < WIDTH ? "grid-cols-1" : "grid-cols-2"} 
          w-full place-items-center items-center place-content-start p-10 gap-5 overflow-y-auto dark-scrollbar`
          }>

          {
            searchUsers.length === 0 ?
              users.map((user) => (
                <SearchedFriend key={user._id} user={user} />
              )) :
              searchUsers.map((user) => (
                <SearchedFriend key={user._id} user={user} width={width} />
              ))
          }
          <Inbox />
        </div>
      </div>
    </div>
  );
};