import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in!");
      return;
    }

    // Fetch user data (Mock API)
    setTimeout(() => {
      setUser({
        username: "JohnDoe",
        email: "johndoe@example.com",
        gamesPlayed: 15,
        gamesWon: 10,
      });
    }, 1000);
  }, []);

  if (!user) return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-gray-400 mt-2">Welcome, {user.username}!</p>

      <div className="bg-gray-800 p-6 rounded-md mt-6">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Games Played:</strong> {user.gamesPlayed}</p>
        <p><strong>Games Won:</strong> {user.gamesWon}</p>
      </div>
    </div>
  );
};

export default Dashboard;
