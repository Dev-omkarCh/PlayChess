import React, { useState } from "react";
import { FiUser, FiMenu, FiX } from "react-icons/fi";
import { FaPlay, FaUserFriends } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import ChessImage from "../assets/chess.png";
import useAuth from "../store/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useLogout from "../hooks/useLogout";

export default function PlayMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { authUser, setAuthUser} = useAuth();
  const navigate = useNavigate()
  const { loading, logout } = useLogout()

  const handleSendToProfile = () => {
    navigate('/profile');
  };

  const handleLogout = () => {
    logout();
  }

  return (
    <div className="h-[100svh] w-[100svw] bg-gray-900 text-white flex flex-col md:flex-row gap-10 items-center justify-center relative px-6 md:px-16 lg:px-24">
      {/* Profile & Hamburger Menu */}
      <div className="absolute top-5 left-5 flex items-center space-x-4">
        <button onClick={handleSendToProfile}><FiUser className="text-3xl cursor-pointer hover:text-green-400 transition duration-300" /></button>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-3xl focus:outline-none"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Menu List */}
      {menuOpen && (
        <div className="absolute top-16 left-5 bg-gray-800 p-4 rounded-lg shadow-lg w-48">
          <ul className="space-y-3">
            <li className="hover:text-green-400 cursor-pointer">Profile</li>
            <li className="hover:text-green-400 cursor-pointer">Settings</li>
            <li className="hover:text-green-400 cursor-pointer">
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      )}

      {/* Main Play Section */}
      <div className="bg-gray-800 p-8 rounded-lg flex justify-center items-center flex-col h-[70%] shadow-xl text-center w-full max-w-lg md:w-1/2">
        <div>
          <h2 className="text-3xl font-extrabold mb-4 text-green-400">
            Ready to Play?
          </h2>
          <p className="text-gray-300 font-sans">
            Challenge friends or compete with players worldwide.
          </p>
        </div>

        {/* Play & Invite Buttons with Tooltips */}
        <div className="mt-6 flex flex-col gap-4 w-full justify-center items-center">
          <button
            className="flex items-center justify-center gap-3 w-[90%] bg-green-500 hover:bg-green-600 active:translate-y-1 transition-all duration-300 py-3 rounded-lg text-lg font-bold shadow-[0_4px_0_#357a38] relative"
            data-tooltip-id="play-tooltip"
            onClick={() => navigate("/play")}
          >
            <FaPlay /> Play Now 
          </button>

          <button
            className="flex items-center justify-center gap-3 w-[90%] bg-blue-500 hover:bg-blue-600 active:translate-y-1 transition-all duration-300 py-3 rounded-lg text-lg font-bold shadow-[0_4px_0_#1d4ed8] relative"
            data-tooltip-id="invite-tooltip"
            onClick={() => navigate("/invite")}
          >
            <FaUserFriends /> Invite Friends
          </button>
        </div>

        {/* Tooltips */}
        <Tooltip id="play-tooltip" place="top" effect="solid">
          Start a match now!
        </Tooltip>
        <Tooltip id="invite-tooltip" place="top" effect="solid">
          Invite a friend to play!
        </Tooltip>
      </div>

      {/* Chess Image (Only Visible on Larger Screens) */}
      <div className="hidden md:flex h-full justify-center items-center w-[50%] ">
        <img
          src={ChessImage}
          alt="Chess Illustration"
          className="w-[90%] object-contain rounded-lg"
        />
      </div>
    </div>
  );
}
