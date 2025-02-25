import { FaUserMinus, FaUserPlus } from "react-icons/fa";
import useFriendStore from "../../store/useFriendStore";

export default function SearchedFriend({ user }) {

  // changes tested
  const { friends, sendFriendRequest } = useFriendStore();
  const isFriend = friends.some((friend) => friend._id === user._id);

  const handleFriendRequest = async () => {
    if (isFriend) {
      // Handle unfriend logic here
    } else {
      await sendFriendRequest(user._id);
    }
  }

  // end

  return (
    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg w-[380px]">
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
