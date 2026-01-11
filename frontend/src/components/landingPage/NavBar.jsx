import React, { useState } from 'react';
import { FaChessKnight } from 'react-icons/fa';
import { Avatar } from "../../components/ui/avatar";
import { FaBars } from 'react-icons/fa';
import useAuth from '../../store/useAuth';
import { IoPersonCircleSharp } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import { getRandomColor } from '../../utils/randomColorGenerator';
import useAuthStore from '@/store/authStore';
const NavBar = () => {
  const { authUser } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="bg-secondary p-4 flex items-center justify-between shadow-lg border-b-2 border-sectionBorder">
      <div className="flex items-center gap-4">
        <FaChessKnight className="text-[#6CA72E] text-2xl" />
        <h1 className="text-white font-semibold text-lg">ChessNerds</h1>
      </div>

      <div className="hidden md:flex items-center gap-6">
        <Link to="/" className="text-white hover:text-[#A8E639]">Home</Link>
        <Link to="/profile" className="text-white hover:text-[#A8E639]">Profile</Link>
        <Link to="/leaderBoard" className="text-white hover:text-[#A8E639]">leaderBoard</Link>
        <div className="flex items-center">
          {authUser ? (
            <button onClick={()=> navigate("/profile")}>
              <img 
                className="w-10 h-10 rounded-full border-2 border-[#A8E639]" 
                src={authUser?.profileImg || '/placeholder.png'} 
                alt="Profile"
              />
          </button>
          ) : (
            <div className="w-10 h-10 rounded-full border-2 border-gray-500 flex items-center justify-center text-white">
              <button onClick={()=> navigate("/login")}>
                <IoPersonCircleSharp className='h-10 w-10' title='login' />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hamburger Menu */}
      <div className="md:hidden">
        <FaBars className="text-white text-2xl" onClick={() =>{ console.log("open");  setIsOpen(!isOpen)} } />
      </div>

      {isOpen && (
        <div className="absolute z-[100] top-16 right-4 bg-[#2C2C2C] p-4 flex justify-center items-center shadow-lg rounded-lg md:hidden w-[50%] h-[50%] flex-col-reverse gap-5">
          <Link to="/leaderBoard" className="text-white hover:text-[#A8E639]">leaderBoard</Link>
          <Link to="/profile" className="text-white hover:text-[#A8E639]">Profile</Link>
          <Link to="/" className="text-white hover:text-[#A8E639]">Home</Link>
          <div className="flex justify-center items-center">
            {authUser ? (
              <Avatar>
                <button className={`${getRandomColor()}`} onClick={()=> navigate("/profile")}>
                  <img 
                    className=" rounded-full border-2 border-[#A8E639]" 
                    src={authUser?.profileImg || '/placeholder.png'} 
                  />
                </button>
                
              </Avatar>
            ) : (
              <div className="w-20 h-20 rounded-full border-2 border-gray-500 flex items-center justify-center text-white">
                <button onClick={()=> navigate("/login")}>
                  <IoPersonCircleSharp className='h-20 w-20' title='login' />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;