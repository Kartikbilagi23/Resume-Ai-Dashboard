import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBrain,
  FaBriefcase,
  FaRobot,
  FaCreditCard,
  FaChevronLeft
} from "react-icons/fa";
import React from "react"

const navItems = [
  { name: "Dashboard", icon: FaHome, path: "/dashboard" },
  { name: "Skills", icon: FaBrain, path: "/skills" },
  { name: "Applications", icon: FaBriefcase, path: "/applications" },
  { name: "Resume AI", icon: FaRobot, path: "/resume" },
  { name: "Billing", icon: FaCreditCard, path: "/billing" }
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  return (
    <aside
      className={`h-screen bg-white border-r transition-all duration-300
      ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Brand */}
      <div className="h-16 flex items-center justify-between px-4 border-b">
        <span className={`text-xl font-bold text-blue-600 ${collapsed && "hidden"}`}>
          SkillTrack
        </span>
        <button onClick={() => setCollapsed(!collapsed)}>
          <FaChevronLeft
            className={`transition-transform ${collapsed && "rotate-180"}`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-4 space-y-1 h-[60vh] flex flex-col justify-between">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 mx-3 rounded-lg transition-all
               ${isActive
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "text-gray-600 hover:bg-gray-100"}`
            }
          >
            <item.icon className="text-lg" />
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
