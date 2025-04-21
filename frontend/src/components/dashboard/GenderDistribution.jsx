import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const GenderRatioChart = ({ users, download }) => {
  const [genderData, setGenderData] = useState([]);

  useEffect(() => {
    const fetchGenderData =() => {
      
        const maleCount = users.filter((user) => user.gender === "male").length;
        const femaleCount = users.filter((user) => user.gender === "female").length;
        const otherCount = users.filter((user) => user.gender === "other").length;
        const total = maleCount + femaleCount + otherCount;

        setGenderData([
          { gender: "Male", count: maleCount, percentage: ((maleCount / total) * 100).toFixed(1) },
          { gender: "Female", count: femaleCount, percentage: ((femaleCount / total) * 100).toFixed(1) },
          { gender: "Other", count: otherCount, percentage: ((otherCount / total) * 100).toFixed(1) },
        ]);
    };

    fetchGenderData();
  }, [users]);

  const COLORS = ["#4F46E5", "#10B981","#E11D48",]; // Blue, Red, Green for Male, Female, Other

  return (
    <div id="GenderRatio" className="bg-secondary p-4 rounded-lg shadow-lg text-white">
      <h2 className="text-xl font-semibold mb-3">Gender Ratio</h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={genderData} dataKey="count" nameKey="gender" label={({ percent, name }) => `${name} (${(percent * 100).toFixed(1)}%)`}>
            {genderData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <button className="mt-3 p-3 hover:bg-secondaryVaraintHover bg-secondaryVaraint rounded transition-all duration-300 ease-in-out text-white " onClick={() => download("GenderRatio")}>Download Chart</button>
    </div>
  );
};

export default GenderRatioChart;
