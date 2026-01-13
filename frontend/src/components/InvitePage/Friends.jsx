import { FaPlus } from "react-icons/fa";
import { useOnlineStore } from "../../store/onlineStore";
import { getRandomColor } from "../../utils/randomColorGenerator";
import { useFriend } from "../../hooks/useFriend";
import StatusIndicator from "../StatusIndicator";
import ProfileImage from "../ProfileImage";
import { useEffect, useState } from "react";
import useRequest from "@/hooks/useRequest";

const Friends = ({ friend }) => {

  const { onlineUsers } = useOnlineStore();
  const { sendGameRequest } = useRequest();
  const [color, setColor] = useState("bg-blue-500");

  const isOnline = onlineUsers.some((user) => user === friend._id);

  // To Keep Color's the Same
  useEffect(() => {
    setColor(getRandomColor());
  }, []);

  const handleSendGameRequest = () => {
    if (isOnline && friend._id) {
      sendGameRequest(friend?._id);
    }
  };

  return (
    <div
      className={`Friends flex items-center justify-between p-3 min-w-fit shrink w-[90%] ${isOnline ? "bg-[#3a463f]" : "bg-[#31302e]"} 
      rounded-new border border-sectionBorder`}>

      <div className="flex items-center space-x-3 relative">

        {/* Profile Image */}
        <div className={` w-12 h-12 rounded-full overflow-hidden ${color} flex items-center justify-center`}>
          <ProfileImage user={friend} />
          <StatusIndicator isOnline={isOnline} />
        </div>

        {/* Friend Details */}
        <div>
          <p className="text-sm font-medium capitalize">{friend.username}</p>
          <p className={`text-xs ${isOnline ? "text-green-400" : "text-gray-500"} `}>{isOnline ? "online" : "offline"}</p>
        </div>
      </div>

      {/* Send Game Request Button "+" */}
      <button className={`p-2 bg-[#3b3b39] rounded-full ${isOnline ? "bg-[#535353] hover:bg-[#676767] cursor-pointer" : ""} 
        transition-all duration-300 cursor-auto`} onClick={handleSendGameRequest}
      >
        <FaPlus className={` text-sm ${isOnline ? "text-white" : "text-[#70747c]"}`} />
      </button>
    </div>
  );
};

export default Friends;
