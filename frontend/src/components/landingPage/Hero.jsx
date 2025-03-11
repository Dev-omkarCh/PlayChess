import React from "react";
import HeroImage from "../../assets/s1.png" ;
import { useNavigate } from "react-router-dom";
import Button from "../Button";
const HeroSection = () => {

  const navigate = useNavigate();
  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${HeroImage})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Hero Content */}

      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white px-6">
        <h1 className="text-5xl sm:text-7xl md:text-6xl font-extrabold leading-tight tracking-wide text-gray-100 font-[san serif]">
          Welcome to the Chess Platform
        </h1>
        <p className="mt-4 text-base sm:text-lg md:text-xl max-w-2xl text-gray-300 font-[Segoe UI]">
          Chess is the only game where luck doesn't play any role in winning. Play Chess with your friends online in our chess platform
        </p>
        <Button handleOnClick={() => navigate("/login")} color="green" className={"mt-6 px-6 py-3 md:px-8 md:py-4"} width={"w-fit"} text={"Get Started"} />
      </div>
    </div>
  );
};

export default HeroSection;
