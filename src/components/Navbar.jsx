import React from 'react'
import { useState,useEffect } from 'react'
import UserAvatar from '../assets/User.svg'
import Bells from '../assets/Bell.svg'
import '../App.css'

import {
  FaBell,
  FaUserCircle,
  FaBars,
  FaPlus
} from "react-icons/fa";
import { useNavigate, useLocation } from 'react-router-dom';
const pageConfig = {
  "/dashboard": { title: "Dashboard" },
  "/skills": { title: "Skills", action: "+Add Skill" },
  "/applications": { title: "Applications", action: "+Add Applications" },
  "/resume": { title: "Resume AI" },
  "/billing": { title: "Billing" }
}

const Navbar = ({ togglesidebar }) => {
  const [open, setopen] = useState(false);
  const [user, setuser] = useState(null)
  const navigate = useNavigate();
  const location = useLocation();

  const current = pageConfig[location.pathname] || { title: "Dashboard" };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  }
  useEffect(() => {
  const fetchuser=async () => {
    try {
      const token=localStorage.getItem("token");
      const res=await fetch("http://localhost:5000/api/auth/me",{
        headers:{
          Authorization:`Bearer ${token}`,
        },
      });
      const data=await res.json();
      if(!res.ok){
        return;
      }
     setuser(data);
    } catch (error) {
      console.log(error);
    }
  };
  fetchuser();
}, [])
  const downloadReport = async () => {
  try {
    const token = localStorage.getItem("token");
    if(!token){
      alert("No token bro...")
      return;
    }
    const res = await fetch("http://localhost:5000/api/admin/report", {
      method:'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    if (!res.ok) {
      const err = await res.json();
      alert(err.message);
      return;
    }
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.pdf";
    a.click();
  } catch (error) {
    console.log(error);
  }
}

  return (
    <div className='w-full h-[88px] wheat bg-[#151821] border-black flex items-center gap-[15%] pb-3 '>
      {/* left */}
      <div className='flex items-center gap-4'>
        <div>
          <p className='text-sm text-gray-400'>DashBoard/{current.title}</p>
          <h1 className='text-xl font-semibold text-gray-800'>{current.title}</h1>
        </div>
      </div>
      {/* right */}
      <div className='flex items-center gap-5 relative'>
        {/* Action Buttons */}
        {current.action && (
          <button className='hidden md:flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700'>
            <FaPlus size={12} />
          </button>
        )}
      {user?.role === "admin" && (
        <button
          onClick={downloadReport}
          className="reportbtn px-4 py-2 rounded-lg shadow-lg hover:scale-105 transition ml-4"
        >
          📄 Download Report
        </button>
      )}
      </div>
      {/* Notifications */}
      <div className='relative'>
        <img src={Bells} alt="User"
          className="w-[30px] h-[30px] cursor-pointer rounded-full hover:scale-105 transition"
        />
        <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full'>
          2
        </span>
      </div>
      {/* Profile */}
      <div>
        <img src={UserAvatar} alt="User" onClick={() => setopen(!open)}
          className="w-[30px] h-[30px] cursor-pointer rounded-full hover:scale-105 transition"
        />{open && (
          <div className='absolute right-0 mt-3 bg-[white] rounded-[12px] z-50 shadow-lg overflow-hidden'>
            <div className='px-4 pl-[10px] py-3'>
              <p className=' roboto-mono-font text-sm font-medium black text-gray-950'>
                {user?.name||"User"}
              </p>
              <p className=' black text-[12px] text-gray-400'>Student</p>
            </div>
            <hr />
            <button onClick={() => { setopen(!open), navigate('/profile') }} className=' dropbtn w-full text-left px-4 py-2 text-sm hover:bg-gray-50'>
              Profile Settings
            </button>
            <button
              onClick={logout}
              className=' dropbtn w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50'
            >Logout</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar