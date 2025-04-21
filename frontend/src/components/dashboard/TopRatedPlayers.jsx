import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const TopRatedPlayers = ({ data }) => {
  const [topPlayers, setTopPlayers] = useState([]);

  useEffect(() => {
    const fetchTopPlayers = async () => {
      if(data){
          const sortedPlayers = [...data]
            .sort((a, b) => b.elo - a.elo)
            .slice(0, 10);
          setTopPlayers(sortedPlayers);
      }
    };

    fetchTopPlayers();
  }, [data]);

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
    <div className="bg-secondary p-4 rounded-lg shadow-lg text-white">
      {topPlayers.elo}
      <h2 className="text-xl font-semibold mb-3">🏆 Top 10 Rated Players</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-sectionBorder">
          <thead>
            <tr className="bg-primary">
              <th className="p-2 border border-sectionBorder">#</th>
              <th className="p-2 border border-sectionBorder">Player</th>
              <th className="p-2 border border-sectionBorder">ELO</th>
              <th className="p-2 border border-sectionBorder">Wins</th>
              <th className="p-2 border border-sectionBorder">Losses</th>
              <th className="p-2 border border-sectionBorder">Draws</th>
            </tr>
          </thead>
          <tbody>
            {topPlayers.map((player, index) => (
              <tr key={player?._id} className="text-center hover:bg-gray-700">
                <td className="p-2 border border-sectionBorder">{index + 1}</td>
                <td className="p-2 border border-sectionBorder">{player?.username}</td>
                <td className="p-2 border border-sectionBorder font-bold">{player?.elo}</td>
                <td className="p-2 border border-sectionBorder text-green-400">{player?.rapid?.win}</td>
                <td className="p-2 border border-sectionBorder text-red-400">{player?.rapid?.lose}</td>
                <td className="p-2 border border-sectionBorder text-yellow-400">{player?.rapid?.draw}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="mt-3 p-3  rounded transition-all duration-300 ease-in-out text-white hover:bg-secondaryVaraintHover bg-secondaryVaraint" onClick={downloadExcel}>
            Download Table
        </button>
    </div>
  );
};

export default TopRatedPlayers;
