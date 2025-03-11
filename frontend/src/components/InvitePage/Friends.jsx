import { FaPlus } from "react-icons/fa";
import { useOnlineStore } from "../../store/onlineStore";
import { getRandomColor } from "../../utils/randomColorGenerator";
import { showCustomToast } from "../../utils/CustomToast";
import { useFriend } from "../../hooks/useFriend";

const Friends = ({ friend }) => {

  const { onlineUsers } = useOnlineStore();
  const { sendGameRequest } = useFriend();
  const isOnline = onlineUsers.some((user) => user === friend._id);


  const handleSendGameRequest = () => {
     if(isOnline){
        sendGameRequest(friend?._id);
     }
  }

  return (
    <div
      className={`flex items-center justify-between p-3 w-[90%] rounded-lg ${friend.status === "online" ? "bg-[#42444b]" : "bg-[#37393F]"}`}
    >
      <div className="flex items-center space-x-3 relative">
        <div className={` w-12 h-12 rounded-full overflow-hidden ${getRandomColor()} flex items-center justify-center`}>
        {
          friend.profileImgs ? (
              <img src={friend.profileImgs} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
              <span className="text-white font-bold text-lg capitalize">{friend?.username?.charAt(0)?.toUpperCase()}</span>
          )
        }
        {isOnline && (
            <span className="absolute top-0 left-0 w-3 h-3 bg-green-500 rounded-full border-2 z-50 border-gray-800"></span>
          )}
        </div>
        <div>
          <p className="text-sm font-medium">{friend.username}</p>
          <p className="text-xs text-gray-400">{isOnline ? "online" : "offline"}</p>
        </div>
      </div>
      <button className={`p-2 bg-gray-600 rounded-full ${isOnline ? "hover:bg-gray-500" : ""} transition`} 
      onClick={() => handleSendGameRequest()}
      >
        <FaPlus className={` text-sm ${isOnline? "text-white" : "text-gray-400"}`} />
      </button>
    </div>
  )
}

export default Friends
