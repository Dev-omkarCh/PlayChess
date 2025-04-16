import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ChessAnalyticsDashboard from "./Dashboard";
import TopRatedPlayers from "../components/dashboard/TopRatedPlayers";
import GenderRatioChart from "../components/dashboard/GenderDistribution";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [gameHistory, setGameHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const dashboardRef = useRef(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, gameRes, notifRes] = await Promise.all([
          axios.get("/api/users/all"),
          axios.get("/api/users/games"),
          axios.get("/api/users/notifications"),
        ]);

        setUsers(userRes.data);
        setGameHistory(gameRes.data);
        setNotifications(notifRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  // ELO Distribution Data
  const eloData = [
    { range: "400-800", count: users.filter((u) => u.elo >= 400 && u.elo < 800).length },
    { range: "800-1200", count: users.filter((u) => u.elo >= 800 && u.elo < 1200).length },
    { range: "1200-1600", count: users.filter((u) => u.elo >= 1200 && u.elo < 1600).length },
    { range: "1600+", count: users.filter((u) => u.elo >= 1600).length },
  ];

  // Game Outcomes Distribution
  const outcomeData = [
    { type: "Checkmate", count: gameHistory.filter((g) => g.type === "checkmate").length },
    { type: "Resign", count: gameHistory.filter((g) => g.type === "resign").length },
    { type: "Draw", count: gameHistory.filter((g) => g.type === "draw").length },
  ];
  

  // Win Rate by Color
  const winRateData = [
    { color: "White Wins", count: gameHistory.filter((g) => g.won.includes("white")).length },
    { color: "Black Wins", count: gameHistory.filter((g) => g.won.includes("black")).length },
    { color: "Draws", count: gameHistory.filter((g) => g.won.length === 2).length },
  ];

  // Notification Statistics
  const notificationTypes = ["friend-request", "game-request", "accept-game-request", "declined-friend-request"];
  const notificationData = notificationTypes.map((type) => ({
    type,
    count: notifications.filter((n) => n.type === type).length,
  }));

  // Download Chart as Image
  const downloadChartAsImage = (chartId) => {
    const chart = document.getElementById(chartId);
    html2canvas(chart).then((canvas) => {
      const link = document.createElement("a");
      link.download = `${chartId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  };

  // Download Dashboard as PDF
  const downloadDashboardPDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");
    html2canvas(dashboardRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
      pdf.save("Admin_Dashboard.pdf");
    });
  };

  return (
    <div ref={dashboardRef} className="p-6 min-h-screen bg-[#111827]">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ELO Distribution */}
        <ChessAnalyticsDashboard />
        <div id="eloChart" className="bg-[#1f2937] p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-3">ELO Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eloData}>
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <button className="mt-3 p-3 hover:text-gray-300 rounded transition-all duration-300 ease-in-out text-white bg-[#293749] " onClick={() => downloadChartAsImage("eloChart")}>Download Chart</button>
        </div>

        {/* Game Outcomes Distribution */}
          <div id="gameOutcomeChart" className="bg-[#1f2937] p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Game Outcomes</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie 
            data={outcomeData} 
            dataKey="count" 
            nameKey="type" 
            label 
            fill="#82ca9d"
                >
            {outcomeData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={["#22c55e", "#ef4444", "#3b82f6"][index % 3]} />
            ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <button className="mt-3 p-3 hover:text-gray-300 rounded transition-all duration-300 ease-in-out text-white bg-[#293749]" onClick={() => downloadChartAsImage("gameOutcomeChart")}>Download Chart</button>
          </div>

          {/* Win Rate by Color */}
        <div id="winRateChart" className="bg-[#1f2937] p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-3">Win Rate by Color</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={winRateData}>
              <XAxis dataKey="color"/>
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#ff7300" />
            </BarChart>
          </ResponsiveContainer>
          <button className="mt-3 p-3 hover:text-gray-300 rounded transition-all duration-300 ease-in-out text-white bg-[#293749]" onClick={() => downloadChartAsImage("winRateChart")}>Download Chart</button>
        </div>

        {/* Notification Statistics */}
        <div id="notificationChart" className="bg-[#1f2937] p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-3">Notification Statistics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={notificationData}>
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
          <button className="mt-3 p-3 hover:text-gray-300 rounded transition-all duration-300 ease-in-out text-white bg-[#293749]" onClick={() => downloadChartAsImage("notificationChart")}>Download Chart</button>
        </div>

        <TopRatedPlayers data={users} />
        <GenderRatioChart users={users} />

      </div>

      <button className="mt-6 bg-blue-500 text-white px-4 py-2" onClick={downloadDashboardPDF}>
        Download Dashboard PDF
      </button>
    </div>
  );
};

export default AdminDashboard;
