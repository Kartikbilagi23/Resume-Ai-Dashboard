import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { PieChart, Pie, Cell, Legend } from 'recharts';
import { useEffect, useState } from 'react';
const token=localStorage.getItem("token")
const Dashboard = () => {
  const [stats, setstats] = useState([]);
  const [chartData, setchartData] = useState([]);

  const resumeCompareData = [
    { name: "You", value: 70 },
    { name: "Candidate A", value: 82 },
    { name: "Candidate B", value: 60 }
  ];
  const COLORS = ["#3b82f6", "#22c55e", "#f97316"];
  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setstats([
          { title: "Skills Added", value: data.skillsCount },
          { title: "Applications Added", value: data.applicationsCount },
          {
            title: "Resume Score",
            value: data.resumeScore !== null
              ? `${data.resumeScore}%`
              : "Not analysed",
          },
          { title: "Subscription", value: data.subscription },
        ]);
        setchartData(data.applicationsChart);
      })
      .catch(() => console.log("Dashboard fetch failed"));
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ml-[5%]">

      {/* Stat Cards */}
      <div className="lg:col-span-2 space-y-6 flex gap-[36vw]">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <p className="text-gray-500 text-sm">{item.title}</p>
              <h2 className="text-2xl font-bold mt-2">{item.value}</h2>
            </div>
          ))}
        </div>
      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="text-lg font-semibold mb-4">
          Resume Comparison
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={resumeCompareData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {resumeCompareData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      </div>
      {/* Charts */}
      <div className=" bg-white rounded-xl p-4 shadow w-[50vw]">
        <h2 className="text-lg font-semibold mb-4">
          Applications Overview
        </h2>
{/* caution->RIGHT NOW CHART DATA IS IDEAL BUT LATER U CAN UPDATE IT TO FETCH FROM REAL TIME RESUME ANALYSIS */}
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;

