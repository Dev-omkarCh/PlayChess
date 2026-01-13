import { getRandomColor } from '../../utils/randomColorGenerator';
import { useResponsiveStore } from '../../store/responsiveStore.js';
import { useOnlineStore } from '../../store/onlineStore.js';

import useFriendStore from '../../store/useFriendStore.js';
import { useFriend } from '../../hooks/useFriend.js';
import { useEffect, useRef, useState } from 'react';

import Friends from './Friends';
import NavigateBack from '../NavigateBack.jsx';
import ProfileImage from '../ProfileImage.jsx';
import useAuthStore from '@/store/authStore';

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
    const { authUser } = useAuthStore();
    const { onlineUsers } = useOnlineStore();
    const sortedFriends = sortFriends([...friends], onlineUsers); // Sorting the friends array by online Users
    const sidebarRef = useRef(null);
    const { getAllFriendsList } = useFriend();
    const [color, setColor] = useState("bg-blue-500");

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target) && width < WIDTH) {
                setIsOpen(false);
            }
        };

        setColor(getRandomColor());
        getAllFriendsList();

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, []);

    const EmptyFriends = () => {
        return (
            <div className="flex m-4 flex-col items-center justify-center p-10 bg-[#2b2d31] rounded-lg border-2 border-dashed border-gray-600 h-fir">
                {/* Cool Icon with pulse effect */}
                <div className="relative mb-4">
                    <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="relative h-16 w-16 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </div>

                <h3 className="text-xl font-semibold text-white">No friends yet?</h3>
                <p className="text-gray-400 text-sm text-center mt-2 max-w-xs">
                    It's lonely here! Why not invite someone or search for your squad?
                </p>
            </div>
        );
    };

    return (

        <div
            className={`Sidebar ${width < WIDTH ? "absolute w-[75%] z-100" : "relative w-[20%]"} ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
            h-full text-white bg-[#2a2825] border-r border-sectionBorder transition-all duration-300 ease-out z-50`}
            ref={sidebarRef}
        >
            {/* Top Section */}
            <div className="w-full h-[8%] flex justify-start pl-5 items-center bg-primary border-b border-sectionBorder">
                <NavigateBack path={"/menu"} />
                <h2 className="text-lg font-semibold ml-3">Friends Online</h2>
            </div>

            {/* All Friend's List */}
            <div className={`w-full h-[82%] flex-grow flex ${sortedFriends.length > 0 ? "justify-start" : "justify-center"} items-center flex-col overflow-y-auto dark-scrollbar pt-3 gap-4`}>
                {sortedFriends.length === 0 ? <EmptyFriends /> :
                    sortedFriends.map((friend) => (
                        <Friends key={friend?._id} friend={friend} />
                    ))}
            </div>

            {/* Bottom Me Section */}
            <div className=" absolute bottom-0 left-0 w-full p-4 flex items-center space-x-3 bg-primary border-t border-sectionBorder">
                <div className={`w-12 h-12 rounded-full overflow-hidden ${color} flex items-center justify-center`}>
                    <ProfileImage user={authUser} />
                    <span className="absolute top-4 left-4 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></span>
                </div>
                <div>
                    <p className="text-sm font-medium">{authUser?.username}</p>
                    <p className="text-xs text-gray-400">You</p>
                </div>
            </div>
        </div>
    );
};

export default SideBar;
