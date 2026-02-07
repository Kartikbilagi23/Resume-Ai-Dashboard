import React from 'react'
import { useState } from 'react'
import UserAvatar from '../assets/User.svg'
import Bells from '../assets/Bell.svg'

import {
  FaBell,
  FaUserCircle,
  FaBars,
  FaPlus
} from "react-icons/fa";
import { useNavigate,useLocation } from 'react-router-dom';
const pageConfig={
  "/dashboard":{title:"Dashboard"},
  "/skills":{title:"Skills",action:"+Add Skill"},
  "/applications":{title:"Applications",action:"+Add Applications"},
  "/resume":{title:"Resume AI"},
  "/billing":{title:"Billing"}
}
const Navbar = ({togglesidebar}) => {
  const [open, setopen] = useState(false);
  const navigate=useNavigate();
  const location=useLocation();

  const current=pageConfig[location.pathname]||{title:"Dashboard"};

  const logout=()=>{
    localStorage.removeItem("token");
    navigate("/login");
  }
  return (
    <div className='w-full h-16 bg-[#3b82f6bf] border-b flex items-center gap-[21%] px-6'>
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
        {current.action&&(
          <button className='hidden md:flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700'>
            <FaPlus size={12}/>
          </button>
        )}
      </div>
          {/* Notifications */}
          <div className='relative'>
            <img src={Bells} alt="User"
  className="w-[3vw] h-[3vh] cursor-pointer rounded-full hover:scale-105 transition"
/>
            <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full'>
              2
            </span>
          </div>
          {/* Profile */}
          <div>
            <img src={UserAvatar} alt="User" onClick={() => setopen(!open)}
  className="w-[8vw] h-[8vh] cursor-pointer rounded-full hover:scale-105 transition"
/>{open&&(
              <div className='absolute right-0 mt-3 bg-[white] border rounded-xl shadow-lg overflow-hidden'>
                <div className='px-4 py-3'>
                  <p className='text-sm font-medium text-gray-800'>
                    Kartik bilagi
                  </p>
                  <p className='text-xs text-gray-400'>Student</p>
                </div>
                <hr />
                <button className='w-full text-left px-4 py-2 text-sm hover:bg-gray-50'>
                  Profile Settings
                </button>
                <button
                onClick={logout}
                className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50'
                >Logout</button>
              </div>
            )}
          </div>
    </div>
  )
}

export default Navbar