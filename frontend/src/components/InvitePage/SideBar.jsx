import React, { useEffect, useRef, useState } from 'react';
import Friends from './Friends';
import useAuth from '../../store/useAuth';
import { getRandomColor } from '../../utils/randomColorGenerator';
import useFriendStore from '../../store/useFriendStore.js';
import { useResponsiveStore } from '../../store/responsiveStore.js';
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const sortFriends = (friendsArray) => {
    return friendsArray.sort((a, b) => (a.status === "online" ? -1 : 1));
};

const SideBar = ({ width, isOpen, setIsOpen }) => {
    
    const { friends } = useFriendStore();
    const { WIDTH } = useResponsiveStore();
    const { authUser } = useAuth();
    const sortedFriends = sortFriends([...friends]); // Sorting the friends array
    const sidebarRef = useRef(null);
    const navigate = useNavigate()

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target) && width < WIDTH) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        // document.addEventListener("click", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
            // document.removeEventListener('click', handleClickOutside);
            
        };
    },[]);


    return (
        
          <div 
          className={`sidebar ${width < WIDTH ? "absolute w-[75%] z-100" : "relative w-[20%]"} ${isOpen ? 'translate-x-0' : '-translate-x-full' } h-full text-white
           bg-[#2a2825] border-r border-sectionBorder transition-all duration-300 ease-out z-50`}
            ref={sidebarRef}
           > 

            <div className="w-full h-[8%] flex justify-start gap-5 pl-5 items-center bg-primary border-b border-sectionBorder">
                <button onClick={()=> navigate("/menu")}>
                    <IoMdArrowRoundBack className='text-lg' />
                </button>
                <h2 className="text-lg font-semibold">Friends Online</h2>  
            </div>
            <div className="w-full h-[82%] flex-grow flex justify-start items-center flex-col overflow-y-auto dark-scrollbar pt-3 gap-4">


            {sortedFriends.map((friend) => (
            <Friends key={friend?._id} friend={friend} />
            ))}
            </div>
            

            <div className=" absolute bottom-0 left-0 w-full p-4 flex items-center space-x-3 bg-primary border-t border-sectionBorder">
            <div className={`w-12 h-12 rounded-full overflow-hidden ${getRandomColor()} flex items-center justify-center`}>
                {authUser.profileImgs ? (
                    <img src={authUser.profileImgs} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-white font-bold text-lg capitalize">{authUser?.username.charAt(0).toUpperCase()}</span>
                )}

                {/* Online Status Indicator */}
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
