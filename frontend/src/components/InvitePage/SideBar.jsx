import { getRandomColor } from '../../utils/randomColorGenerator';
import { useResponsiveStore } from '../../store/responsiveStore.js';
import { useOnlineStore } from '../../store/onlineStore.js';

import useFriendStore from '../../store/useFriendStore.js';
import { useFriend } from '../../hooks/useFriend.js';
import { useEffect, useRef } from 'react';

import useAuth from '../../store/useAuth';
import Friends from './Friends';
import NavigateBack from '../NavigateBack.jsx';
import ProfileImage from '../ProfileImage.jsx';

const sortFriends = (allFriendsList, onlineUsers) => {

    return allFriendsList?.sort((a, b) => {
        if (!a._id && !b._id && !onlineUsers) return 0;
        if (onlineUsers.includes(a._id) && !onlineUsers.includes(b._id)) return -1;
        if (!onlineUsers.includes(a._id) && onlineUsers.includes(b._id)) return 1;
        return 0;

    });

};

const SideBar = ({ width, isOpen, setIsOpen }) => {

    const { friends } = useFriendStore();
    const { WIDTH } = useResponsiveStore();
    const { authUser } = useAuth();
    const { onlineUsers } = useOnlineStore();
    const sortedFriends = sortFriends([...friends], onlineUsers); // Sorting the friends array by online Users
    const sidebarRef = useRef(null);
    const { getAllFriendsList } = useFriend();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target) && width < WIDTH) {
                setIsOpen(false);
            }
        };

        getAllFriendsList();

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, []);

    return (

        <div
            className={`Sidebar ${width < WIDTH ? "absolute w-[75%] z-100" : "relative w-[20%]"} ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
            h-full text-white bg-[#2a2825] border-r border-sectionBorder transition-all duration-300 ease-out z-50`}
            ref={sidebarRef}
        >
            {/* Top Section */}
            <div className="w-full h-[8%] flex justify-start gap-5 pl-5 items-center bg-primary border-b border-sectionBorder">
                <NavigateBack path={"/menu"} />
                <h2 className="text-lg font-semibold">Friends Online</h2>
            </div>
            
            {/* All Friend's List */}
            <div className="w-full h-[82%] flex-grow flex justify-start items-center flex-col overflow-y-auto dark-scrollbar pt-3 gap-4">
                {sortedFriends.map((friend) => (
                    <Friends key={friend?._id} friend={friend} />
                ))}
            </div>

            {/* Bottom Me Section */}
            <div className=" absolute bottom-0 left-0 w-full p-4 flex items-center space-x-3 bg-primary border-t border-sectionBorder">
                <div className={`w-12 h-12 rounded-full overflow-hidden ${getRandomColor()} flex items-center justify-center`}>
                    <ProfileImage user={authUser} />
                    <span className="absolute top-4 left-4 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></span>
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
