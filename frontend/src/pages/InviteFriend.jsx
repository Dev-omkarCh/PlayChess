import { useEffect } from "react";

import SearchedFriend from "../components/InvitePage/SearchedFriend";
import SideBar from "../components/InvitePage/SideBar";
import TopMenu from "../components/InvitePage/TopMenu";
import Inbox from "../components/InvitePage/Inbox";

import useSeachedUsers from "../store/searchStore";
import useFriendStore from "../store/useFriendStore";
import useSocket from "../hooks/useSocket";
import { useFriend } from "../hooks/useFriend";
import useSocketStore from "../store/socketStore";
import { useNavigate } from "react-router-dom";
import { useMainSocket } from "../store/socketIoStore";
import Toast from "../components/MyToast";

export default function FriendsSidebar() {

  const { getFriendRequests, getFriends ,getGameRequests, getAllUsres } = useFriend();
  const { startGameListener } = useSocketStore();
  const { searchUsers } = useSeachedUsers();
  const { friends, friendRequests, users } = useFriendStore();
  const {socket} = useMainSocket()

  // TODO : Connection Point
  // useSocket();
  startGameListener();
  
  // Changes tested
  useEffect(() => {
    getFriendRequests();
    getGameRequests();
    getFriends();
    // getAllUsres()
    
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
          {
            searchUsers.length === 0 &&
            users.map((user)=>(
              <SearchedFriend key={user._id} user={user}  />
            ))
          }
          
          <Inbox />
        </div>
        {/* //TODO: add button Invite by link */}
      </div>
        
    </div>
  );
}

// import { FaSearch, FaBell, FaPlusCircle, FaEnvelope, FaBars, FaTimes } from "react-icons/fa";
// import { useState, useEffect } from "react";

// const App = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   const closeSidebarOnClickOutside = (e) => {
//     if (isSidebarOpen && e.target.closest(".sidebar") === null) {
//       setIsSidebarOpen(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", closeSidebarOnClickOutside);
//     return () => document.removeEventListener("mousedown", closeSidebarOnClickOutside);
//   }, [isSidebarOpen]);

//   return (
//     <div className="h-dvh w-dvw bg-gray-900 flex relative overflow-hidden">
//       {/* Sidebar */}
//       <div
//         className={` absolute h-full sidebar w-80 md:w-96 bg-gray-950 p-4 text-white flex flex-col gap-4 transition-transform duration-300 transform z-20 ${
//           isSidebarOpen ? "translate-x-0 fixed inset-0 backdrop-blur-md" : "-translate-x-full md:translate-x-0 md:relative"
//         }`}
//       >
//         <div className="flex justify-between items-center">
//           <h2 className="text-xl font-semibold">Friends Online</h2>
//           <FaTimes
//             className="text-white text-xl cursor-pointer md:hidden"
//             onClick={() => setIsSidebarOpen(false)}
//           />
//         </div>
//         <div className="flex items-center gap-4 bg-gray-800 p-2 rounded-lg">
//           <img
//             src="https://via.placeholder.com/50"
//             alt="user"
//             className="rounded-full w-10 h-10"
//           />
//           <div className="flex flex-col">
//             <span className="text-sm">ronak</span>
//             <span className="text-xs text-gray-400">offline</span>
//           </div>
//           <FaPlusCircle className="ml-auto text-gray-400 cursor-pointer" />
//         </div>
//         <div className="flex items-center gap-4 bg-gray-800 p-2 rounded-lg">
//           <img
//             src="https://via.placeholder.com/50"
//             alt="user"
//             className="rounded-full w-10 h-10"
//           />
//           <div className="flex flex-col">
//             <span className="text-sm">Dragonexp</span>
//             <span className="text-xs text-gray-400">offline</span>
//           </div>
//           <FaPlusCircle className="ml-auto text-gray-400 cursor-pointer" />
//         </div>
//         <div className="mt-auto bg-gray-800 p-3 rounded-lg flex items-center gap-4">
//           <img
//             src="https://via.placeholder.com/50"
//             alt="user"
//             className="rounded-full w-12 h-12"
//           />
//           <div className="flex flex-col">
//             <span className="text-sm">pooja</span>
//             <span className="text-xs text-green-400">You</span>
//           </div>
//           <span className="w-3 h-3 bg-green-400 rounded-full"></span>
//         </div>
//       </div>

//       {/* Main Section */}
//       <div className={`flex-1 bg-gray-800 transition-all duration-300 overflow-auto ${isSidebarOpen ? "backdrop-blur-md pointer-events-none" : "pointer-events-auto"}`}>
//         {/* Top Navigation Bar */}
//         <div className="p-4 flex items-center gap-4 bg-gray-900">
//           <FaBars
//             className="text-white text-xl cursor-pointer md:hidden"
//             onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//           />
//           <div className="relative w-full">
//             <input
//               type="text"
//               placeholder="Search username"
//               className="w-full p-2 rounded-lg bg-gray-800 text-white outline-none"
//             />
//             <FaSearch className="absolute right-3 top-3 text-gray-400" />
//           </div>
//           <FaSearch className="text-white text-lg cursor-pointer hidden md:block" />
//           <FaBell className="text-white text-lg cursor-pointer hidden md:block" />
//           <div className="w-10 h-10 bg-gray-700 rounded-full hidden md:block"></div>
//         </div>

//         {/* Chat Icon */}
//         <div className="absolute bottom-4 right-4 bg-gray-900 p-3 rounded-full shadow-lg cursor-pointer">
//           <FaEnvelope className="text-white text-xl" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;

