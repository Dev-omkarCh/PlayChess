import React from "react";
import HeroImage from "../../assets/chess1.webp" ;
const HeroSection = () => {
  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${HeroImage})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Hero Content */}
      text-5xl md:text-7xl font-extrabold leading-tight text-gray-300

      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white px-6">
        <h1 className="text-5xl sm:text-7xl md:text-6xl font-extrabold leading-tight tracking-wide text-gray-100 font-[san serif]">
          Welcome to the Chess Platform
        </h1>
        <p className="mt-4 text-base sm:text-lg md:text-xl max-w-2xl text-gray-300 font-[Segoe UI]">
          Chess is the only game where luck doesn't play any role in winning. Play Chess with your friends online in our chess platform
        </p>
        <button className="mt-6 px-6 py-3 md:px-8 md:py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default HeroSection;
