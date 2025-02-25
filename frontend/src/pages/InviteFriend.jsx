import SearchedFriend from "../components/InvitePage/SearchedFriend";
import SideBar from "../components/InvitePage/SideBar";
import TopMenu from "../components/InvitePage/TopMenu";
import Inbox from "../components/InvitePage/Inbox";
import Button from "../components/Button";
import useSeachedUsers from "../store/searchStore";
import { useEffect } from "react";
import useFriendStore from "../store/useFriendStore";
import useSocketStore from "../store/socketStore";
import useAuth from "../store/useAuth";
export default function FriendsSidebar() {

  const { getFriendRequests, friendRequests } = useFriendStore();
  const { searchUsers } = useSeachedUsers();

  // Changes tested
  useEffect(() => {
    getFriendRequests();
  }, []);
  
  // end

  return (
    <div className="h-[100dvh] w-[100dvw] flex bg-primary">
      <SideBar />
      <div className="h-full w-[80%] flex flex-col">
        <TopMenu />
        <div className="h-[80%] w-full grid grid-cols-2 place-content-start p-10 gap-5 overflow-y-auto dark-scrollbar">
          
          {
            searchUsers.map((user) =>(
              <SearchedFriend key={user._id} user={user}  />
            ))
          }
          
          <Inbox />
        </div>
        {/* <Button text={"Invite"} noScale={true} className={"w-[10%] h-fit ml-4"} handleOnClick={handleClick} /> */}
      </div>
        
    </div>
  );
}
