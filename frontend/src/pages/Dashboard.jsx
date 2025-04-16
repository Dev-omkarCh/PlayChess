import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, Cell
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [gameHistory, setGameHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const dashboardRef = useRef(null);

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

  // 📌 **ELO Distribution**
  const eloData = [
    { range: "400-800", count: users.filter((u) => u.elo >= 400 && u.elo < 800).length },
    { range: "800-1200", count: users.filter((u) => u.elo >= 800 && u.elo < 1200).length },
    { range: "1200-1600", count: users.filter((u) => u.elo >= 1200 && u.elo < 1600).length },
    { range: "1600+", count: users.filter((u) => u.elo >= 1600).length },
  ];

  // 📌 **Game Outcomes**
  const outcomeData = [
    { type: "Checkmate", count: gameHistory.filter((g) => g.type === "checkmate").length },
    { type: "Resign", count: gameHistory.filter((g) => g.type === "resign").length },
    { type: "Draw", count: gameHistory.filter((g) => g.type === "draw").length },
  ];

  // 📌 **Win Rate by Color**
  const winRateData = [
    { color: "White Wins", count: gameHistory.filter((g) => g.won.includes("white")).length },
    { color: "Black Wins", count: gameHistory.filter((g) => g.won.includes("black")).length },
    { color: "Draws", count: gameHistory.filter((g) => g.won.length === 2).length },
  ];

  // 📌 **Top Rated Players**
  const topPlayers = [...users].sort((a, b) => b.elo - a.elo).slice(0, 5);

  // 📌 **Player Performance**
  const performanceData = users.map((user) => ({
    username: user.username,
    win: user.rapid.win,
    lose: user.rapid.lose,
    draw: user.rapid.draw,
  }));

  // 📌 **Game Activity by Time (Dynamically Generated from gameHistory)**
  const timeSlots = ["12am-4am", "4am-8am", "8am-12pm", "12pm-4pm", "4pm-8pm", "8pm-12am"];
  const gameActivityData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
    const dayData = gameHistory.filter((game) => {
      const gameDate = new Date(game.createdAt);
      return gameDate.toLocaleDateString("en-US", { weekday: "short" }) === day;
    });

    return {
      day,
      ...Object.fromEntries(timeSlots.map((slot, index) => [slot, dayData.length / (index + 1)])),
    };
  });

  // 📌 **Download Dashboard as PDF**
  const downloadDashboardPDF = () => {
    const pdf = new jsPDF("p", "mm", "a4");
    html2canvas(dashboardRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
      pdf.save("Admin_Dashboard.pdf");
    });
  };

  return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-3">Game Activity by Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={gameActivityData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="12am-4am" stroke="#ff7300" />
              <Line type="monotone" dataKey="4am-8am" stroke="#82ca9d" />
              <Line type="monotone" dataKey="8am-12pm" stroke="#8884d8" />
              <Line type="monotone" dataKey="12pm-4pm" stroke="#ff00ff" />
              <Line type="monotone" dataKey="4pm-8pm" stroke="#00ffff" />
              <Line type="monotone" dataKey="8pm-12am" stroke="#ffff00" />
            </LineChart>
          </ResponsiveContainer>
          <button className="mt-3 p-3 hover:text-gray-300 rounded transition-all duration-300 ease-in-out text-white bg-[#293749]" onClick={downloadDashboardPDF}>
            Download Chart
          </button>
        </div>
        
  );
};

export default AdminDashboard;
