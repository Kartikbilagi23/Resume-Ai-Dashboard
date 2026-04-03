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
import '../App.css'


const token=localStorage.getItem("token")
const Dashboard = () => {
  const [stats, setstats] = useState([]);
  const [chartData, setchartData] = useState([]);
  const [resumeCompareData, setresumeCompareData] = useState([])

  // const resumeCompareData = [
  //   { name: "You", value: 70 },
  //   { name: "Candidate A", value: 82 },
  //   { name: "Candidate B", value: 60 }
  // ];
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
  {
    title: "Skills Added",
    value: data.skillsCount,
    type: "skills",
  },
  {
    title: "Applications Added",
    value: data.applicationsCount,
    type: "applications",
  },
  {
    title: "Resume Score",
    value: typeof data.resumeScore==="number"?data.resumeScore:0,
    type: "resume",
  },
  {
    title: "Subscription",
    value: data.subscription,
    type: "subscription",
  },
]);
        setchartData(data.applicationsChart);
        setresumeCompareData([
          {
            name:"You",
            value:data.resumeScore||0,
          },
          {
            name:"Average",
            value:65,
          },
          {
            name:"Top Candidate",
            value:85,
          },
        ])
      })
      .catch(() => console.log("Dashboard fetch failed"));
  }, []);
  return (
    <div className="p-6 h-[84vh] w-[100%] grid grid-cols-1 xl:grid-cols-4 gap-6">

      {/* Stat Cards */}
      <div className="xl:col-span-3 space-y-6">

        <div className="flex justify-around gap-6 mt-3 pt-[15px]">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className={`pl-[25px] pr-[25px] text-white border rounded-[15px] border-white/10 hover:scale-105 hover:-translate-y-1 transition duration-300`}>
              <p className="color text-sm">{item.title}</p>
              <h2 className="text-2xl font-bold mt-2">{item.value}</h2>
            </div>
          ))}
        </div>
      <div className="bg-[#202430] text-white rounded-xl p-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <h2 className="text-lg font-semibold mb-4">
          Applications Overview
        </h2>
{/* caution->RIGHT NOW CHART DATA IS IDEAL BUT LATER U CAN UPDATE IT TO FETCH FROM REAL TIME RESUME ANALYSIS */}
        <ResponsiveContainer width="90%" height={300}>
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

