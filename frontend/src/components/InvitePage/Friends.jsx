import { FaPlus } from "react-icons/fa";
import { useOnlineStore } from "../../store/onlineStore";

const Friends = ({ friend }) => {

  const { onlineUsers } = useOnlineStore();

  const isOnline = onlineUsers.some((user) => user._id === friend._id); // Check if the friend is online

  return (
    <div
      className={`flex items-center justify-between p-3 w-[90%] rounded-lg ${friend.status === "online" ? "bg-[#42444b]" : "bg-[#37393F]"}`}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          {<img src={friend.profileImg} alt="Avatar" className="w-10 h-10 rounded-full" />}
          {isOnline && 
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></span>
          }
        </div>
        <div>
          <p className="text-sm font-medium">{friend.username}</p>
          <p className="text-xs text-gray-400">{"online"}</p>
        </div>
      </div>
      <button className={`p-2 bg-gray-600 rounded-full ${isOnline ? "hover:bg-gray-500" : ""} transition`}>
        <FaPlus className={` text-sm ${isOnline? "text-white" : "text-gray-400"}`} />
      </button>
    </div>
  )
}

export default Friends
