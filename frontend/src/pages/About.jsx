import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

const About = () => {
  return (
    <div className="min-h-screen bg-primary text-white flex flex-col md:flex-row p-6 md:p-12">
      {/* Sidebar/Profile Section */}
      <div className="w-full md:w-1/3 flex flex-col items-center md:items-start mb-10 md:mb-0">
        <div className="bg-secondary rounded-xl w-full max-w-sm p-6 shadow-lg text-center md:text-left">
          <div className="w-32 h-32 rounded-full mx-auto md:mx-0 mb-4 flex justify-center items-center">
              <CgProfile className="h-full w-full" />
          </div>
          
          <h2 className="text-2xl font-bold text-[#38bdf8]">Omkar</h2>
          <p className="text-gray-400">Final Year BSc IT Student</p>
          <p className="text-gray-500 text-sm mt-2">
            Developer of <strong>NerdChess</strong>
          </p>

          <div className="flex justify-center md:justify-start gap-4 mt-4">
            <a href="https://github.com/Dev-omkarCh" target="_blank" aria-label="GitHub">
              <FaGithub className="text-2xl hover:text-gray-400" />
            </a>
            <a href="https://www.linkedin.com/in/omkar-chikhale-076a00275/" aria-label="Instagram" target="_blank">
              <FaLinkedin className="text-2xl hover:text-gray-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="w-full md:w-2/3 bg-secondary rounded-xl p-6 md:ml-8 shadow-lg">
        <h1 className="text-3xl font-bold text-[#38bdf8] mb-4">About NerdChess</h1>
        <p className="text-gray-300 mb-6 leading-relaxed">
          <strong>NerdChess</strong> is a full-stack multiplayer chess platform built for modern gameplay.
          With features like real-time multiplayer, elo rating system, full game analytics, capture tracking,
          reconnection on refresh, and stylish UI — it delivers a powerful experience across web and mobile.
        </p>

        <div className="mb-6">
          <h2 className="text-xl font-semibold  mb-2">Tech Stack</h2>
          <ul className="list-disc list-inside text-gray-400 space-y-1">
            <li>Frontend: React, Vite, Zustand, TailwindCSS, React-Router</li>
            <li>Backend: Node.js, Express.js, Socket.IO</li>
            <li>Database: MongoDB (Mongoose)</li>
            <li>Features: Realtime Chess Logic, Castling, Promotion, Analytics, Replay</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold  mb-2">Why NerdChess?</h2>
          <p className="text-gray-300">
            Built as a capstone project for final year, NerdChess focuses on performance, reconnection, live game state syncing,
            and full-feature multiplayer experience — everything a modern online chess platform needs.
          </p>
        </div>

        <p className="text-sm text-gray-500 mt-10 text-center md:text-left">
          &copy; {new Date().getFullYear()} NerdChess — Developed by Omkar.
        </p>
      </div>
    </div>
  );
};

export default About;
