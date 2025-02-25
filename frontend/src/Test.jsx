import HeroImage from "./assets/hero.png";
import s1 from "./assets/s1.png";
import s2 from "./assets/s2.png";
import s3 from "./assets/s3.png";

import { FaSearch, FaInstagram, FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";

const Card = ({ image, title, description }) => {
   return (
    <div className=" overflow-hidden">
            <div className="w-full h-[30vh] ">
              <img
                src={image}
                alt="Playing with friends"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col items-start">
                <p className="font-bold mt-2 text-lg">{title}</p>
                <p className="text-gray-400 text-sm">{description}</p>
            </div>
            
    </div>
   )
}

export default function ChessHomepage() {
  return (
    <div className="bg-[#121212] text-white min-h-screen flex flex-col justify-start items-center">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 border-b border-gray-700 h-[10vh] w-[100%]">
        <span className="text-lg font-semibold">Nerds Chess</span>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="bg-gray-800 text-white px-3 py-1 rounded-md"
            />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button className="bg-blue-600 px-4 py-2 rounded-md">Get Started</button>
          <button className="border border-gray-500 px-4 py-2 rounded-md">Login</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div 
        className="text-center flex flex-col justify-center items-center h-[80vh] w-[90%] bg-gray-800 bg-cover bg-center mx-6 my-8 rounded-lg relative object-cover"
        style={{ backgroundImage: `url(${HeroImage})` }}
      >
        <h1 className="text-3xl font-bold relative z-10">Play chess online with friends and Random Players</h1>
        <div className="mt-4 relative w-1/2">
          <input
            type="text"
            placeholder="Find a friend to play chess with"
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 px-4 py-2 rounded-md">
            Search
          </button>
        </div>
      </div>

      {/* Two Ways to Play */}
      <section className="text-center my-8 px-6 h-[50vh] w-[90%] overflow-hidden flex items-start flex-col">
        <h2 className="text-2xl font-semibold mb-4">Two ways to play</h2>
        <div className="flex gap-5 justify-center items-center">
          <Card image={s1} title={"Play with your friends"} description={"Invite and play against your friends online"} />
          <Card image={s2} title={"Play against random players online"} description={"Gain experience and increase your ELO rating"} />
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center p-6 border-t border-gray-700 mt-8 w-full">
        <div className="flex justify-center gap-6 text-gray-400 text-lg">
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaGithub /></a>
          <a href="#"><FaLinkedin /></a>
          <a href="#"><FaFacebook /></a>
        </div>
        <p className="text-gray-500 mt-4">All rights reserved under 2024-25 Chess Master</p>
      </footer>
    </div>
  );
}