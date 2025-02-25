import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import whitePawn from "../../assets/wp.png";

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Hamburger Icon */}
      <button
        className="flex flex-col items-center justify-center w-10 h-10 space-y-1 bg-transparent border-none focus:outline-none"
        onClick={toggleMenu}
      >
        <div
          className={`w-8 h-1 bg-white rounded transition-transform duration-300 ${
            isOpen ? 'rotate-45 translate-y-2' : ''
          }`}
        ></div>
        <div
          className={`w-8 h-1 bg-white rounded transition-opacity duration-300 ${
            isOpen ? 'opacity-0' : ''
          }`}
        ></div>
        <div
          className={`w-8 h-1 bg-white rounded transition-transform duration-300 ${
            isOpen ? '-rotate-45 -translate-y-2' : ''
          }`}
        ></div>
      </button>

      {/* Slide-in Menu */}
      <div
        className={`fixed top-0 left-0 h-full bg-slate-900 text-white w-64 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 h-full w-full">
          <div className="flex align-middle items-center h-[20%] relative w-full ">
            <img src={whitePawn} className='h-[80%]' />
            <IoClose className='text-red-600 text-[1.5rem] absolute right-2 top-2 hover:bg-slate-900 rounded-full cursor-pointer' />
          </div>
          <ul className="mt-4 space-y-2 h-full w-full">
            <li className='h-[5%] w-[50%] flex justify-center items-center rounded-lg hover:bg-slate-800'>
              <a href="#" className="hover:text-gray-300">
                Home
              </a>
            </li>
            <li className='h-[5%] w-[50%] flex justify-center items-center rounded-lg hover:bg-slate-800'>
              <a href="#" className="hover:text-gray-300">
                About
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={toggleMenu}
        ></div>
      )}
    </div>
  );
};

export default HamburgerMenu;
