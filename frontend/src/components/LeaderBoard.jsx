import React, { useEffect, useState } from "react";
import axios from "axios";
import {} from "react-icons/fa6";
import {} from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

const Leaderboard = () => {
  const navigate = useNavigate();
  const context = useAuthContext();
  const authUser = context?.authUser;
  const userId = authUser?._id;
  
  const [leaderboard, setLeaderboard] = useState([]);
  const [yourRank, setYourRank] = useState(null);
  const [yourElo, setYourElo] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(
          "/api/users/leaderboard"
        );
        setLeaderboard(res.data?.leaderboard);
        setYourRank(res.data?.yourRank);
        setYourElo(res.data?.yourElo);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankBadge = (index) => {
    if (index === 0) return "bg-gray-800 text-black shadow-lg"; // 🥇 Gold
    if (index === 1) return "bg-gray-800 text-black shadow-lg"; // 🥈 Silver
    if (index === 2) return "bg-gray-800 text-black shadow-lg"; // 🥉 Bronze
    return "bg-[#1a1b26] text-white"; // Normal Row
  };

  return (
    <>
    <button className="text-3xl m-5" onClick={()=> navigate(-1)}><IoArrowBack /></button>
    <div className="max-w-4xl mx-auto my-10">
      <h2 className="text-4xl font-bold text-center text-purple-500 mb-4 uppercase tracking-wider">
        Leaderboard
      </h2>

      <div className="bg-[#1a1b26] p-5 rounded-lg shadow-xl border border-[#2c2d37]">
        <table className="w-full text-white border-collapse">
          <thead>
            <tr className="text-[#aaa] border-b border-[#292929]">
              <th className="py-2">#</th>
              <th className="text-left">Username</th>
              <th>Elo Rating</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((player, index) => (
              <tr
                key={player?._id}
                className={`transition-all duration-300 ${
                  player?._id === userId
                    ? "bg-[#ffcc00] text-black font-bold animate-glow"
                    : getRankBadge(index)
                } hover:bg-purple-800`}
              >
                <td className="py-3 text-center">
                  {index + 1 === 1 ? "🥇" : index + 1 === 2 ? "🥈" : index + 1 === 3 ? "🥉" : index + 1}
                </td>
                <td className="text-left text-white pl-4 font-bold capitalize">{player?.username}</td>
                <td className="text-center font-semibold text-[#82aaff]">{player?.elo}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ✅ Your Rank Card */}
        {yourRank && (
          <div className="mt-5 bg-[#282c34] p-4 rounded-lg shadow-md">
            <h3 className="text-center text-[#ffcc00] font-semibold">
              🏅 Your Current Standing
            </h3>
            <p className="text-white text-center mt-1">
              Rank: <span className="text-[#ffcc00] p-2 ">{yourRank}</span> | Elo Rating:{ }
              <span className="text-purple-500 p-2">{yourElo}</span>
            </p>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Leaderboard;
