import { FaUserMinus, FaUserPlus } from "react-icons/fa";
import useFriendStore from "../../store/useFriendStore";
import { useFriend } from "../../hooks/useFriend";
import { useResponsiveStore } from "../../store/responsiveStore";
import useRequest from "@/hooks/useRequest";
import useSeachedUsers from "@/store/searchStore";

export default function SearchedFriend({ user, width }) {

  // changes tested
  const { friends} = useFriendStore();
  const { sendFriendRequest } = useRequest();
  const { removeFriend } = useFriend();
  const { WIDTH } = useResponsiveStore();
  const { searchUsers, setSearchUser } = useSeachedUsers();
  
  const isFriend = friends.some((friend) => friend._id === user._id);

  const handleFriendRequest = async () => {
    if (isFriend) {
      await removeFriend(user._id);
    } else {
      await sendFriendRequest(user._id);
    }
  }

  // end

  return (
    <div className={`flex items-center justify-between bg-secondary p-3 rounded-lg ${width < WIDTH ? "w-full" : "w-[80%]"}  z-10 border border-sectionBorder`}>
      <div className=" relative flex items-center space-x-3">
        {/* Avatar */}
        <div className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center`}>
            <img src={user.profileImg} alt="Avatar" className="w-full h-full object-cover" />
        </div>

        {/* User Info */}
        <div>
          <h3 className="text-white font-semibold text-lg">{user.username}</h3>
          <p className="text-gray-400 text-sm">Elo : {user.elo}</p>
        </div>
      </div>

      {/* Add Friend Button */}
      <button 
        className={`p-3 ${isFriend ? "bg-red-500 hover:bg-red-400" : "bg-green-500 hover:bg-green-400"}  rounded-lg  transition`}
        onClick={handleFriendRequest}>
        {isFriend ? <FaUserMinus className="text-white text-lg" /> : <FaUserPlus className="text-white text-lg" />  }
      </button>
    </div>
  );
}
