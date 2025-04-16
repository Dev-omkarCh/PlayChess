import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const TopRatedPlayers = ({ data }) => {
  const [topPlayers, setTopPlayers] = useState([]);

  useEffect(() => {
    const fetchTopPlayers = async () => {
      try {
        if(data){
            const sortedPlayers = [...data]
              .sort((a, b) => b.elo - a.elo)
              .slice(0, 10);
            setTopPlayers(sortedPlayers);
        }
      } catch (error) {
        console.error("Error fetching top players:", error);
      }
    };

    fetchTopPlayers();
  }, []);

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      topPlayers.map((player, index) => ({
        Rank: index + 1,
        Username: player.username,
        ELO: player.elo,
        Wins: player.rapid.win,
        Losses: player.rapid.lose,
        Draws: player.rapid.draw,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Top Rated Players");
    XLSX.writeFile(wb, "Top_Rated_Players.xlsx");
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg text-white">
      <h2 className="text-xl font-semibold mb-3">🏆 Top 10 Rated Players</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-700">
          <thead>
            <tr className="bg-gray-900">
              <th className="p-2 border border-gray-700">#</th>
              <th className="p-2 border border-gray-700">Player</th>
              <th className="p-2 border border-gray-700">ELO</th>
              <th className="p-2 border border-gray-700">Wins</th>
              <th className="p-2 border border-gray-700">Losses</th>
              <th className="p-2 border border-gray-700">Draws</th>
            </tr>
          </thead>
          <tbody>
            {topPlayers.map((player, index) => (
              <tr key={player?._id} className="text-center hover:bg-gray-700">
                <td className="p-2 border border-gray-700">{index + 1}</td>
                <td className="p-2 border border-gray-700">{player?.username}</td>
                <td className="p-2 border border-gray-700 font-bold">{player?.elo}</td>
                <td className="p-2 border border-gray-700 text-green-400">{player?.rapid?.win}</td>
                <td className="p-2 border border-gray-700 text-red-400">{player?.rapid?.lose}</td>
                <td className="p-2 border border-gray-700 text-yellow-400">{player?.rapid?.draw}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="mt-3 p-3 hover:text-gray-300 rounded transition-all duration-300 ease-in-out text-white bg-[#293749]" onClick={downloadExcel}>
            Download Table
        </button>
    </div>
  );
};

export default TopRatedPlayers;
