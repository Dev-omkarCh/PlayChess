import React, { useEffect } from 'react';
import Friends from './Friends';
import useAuth from '../../store/useAuth';
import { getRandomColor } from '../../utils/randomColorGenerator';
import useFriendStore from '../../store/useFriendStore.js';

// const friends = [
//     { id: 1, name: "Username", status: "online", avatar: "" },
//     { id: 2, name: "Username", status: "offline", avatar: "" },
//     { id: 3, name: "Username", status: "online", avatar: "" },
    
// ];

  
const sortFriends = (friendsArray) => {
    return friendsArray.sort((a, b) => (a.status === "online" ? -1 : 1));
};

const SideBar = () => {

    const { getFriends, friends } = useFriendStore();

    useEffect(() => {
        getFriends();
    },[])

    const { authUser } = useAuth();
    const sortedFriends = sortFriends([...friends]); // Sorting the friends array
    let isOnline = true;

    return (
        <div className="w-[20%] h-full bg-[#2B2D31] text-white relative">

            <div className="w-full h-[8%] bg-gray-900 flex justify-center items-center">
            <h2 className="text-lg font-semibold">Friends Online</h2>  
            </div>

            <div className="w-full h-[82%] flex justify-start items-center flex-col overflow-y-auto dark-scrollbar pt-3 gap-4">
            {sortedFriends.map((friend) => (
            <Friends key={friend._id} friend={friend} />
            ))}
            </div>
            

            <div className=" absolute bottom-0 left-0 w-full bg-gray-900 p-4 flex items-center space-x-3">
            {/* <div className="relative">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                    {authUser.username.charAt(0).toUpperCase()}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></span>
            </div> */}
            <div className={`w-12 h-12 rounded-full overflow-hidden ${getRandomColor()} flex items-center justify-center`}>
                {authUser.profileImg ? (
                    <img src={authUser.profileImg} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-white font-bold text-lg capitalize">{authUser?.username}</span>
                )}
                {/* Online Status Indicator */}
                {isOnline && (
                    <span className="absolute top-0 left-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></span>
                )}
            </div>
            <div>
                <p className="text-sm font-medium">{authUser?.username}</p>
                <p className="text-xs text-gray-400">You</p>
            </div>
            </div>
        </div>
    )
}

export default SideBar
