import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const GameOutcomeChart = () => {
  const data = {
    labels: ["Checkmate", "Resign", "Draw"],
    datasets: [
      {
        data: [41, 33, 16, 10],
        backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0"],
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-900 rounded-lg shadow-lg text-white">
      <h2 className="text-xl font-bold mb-4">Game Outcome Analysis</h2>
      <Pie data={data} />
    </div>
  );
};

export default GameOutcomeChart;
