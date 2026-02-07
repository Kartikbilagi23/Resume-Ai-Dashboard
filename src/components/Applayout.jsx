import { useState } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./Navbar";
import React from "react"

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex flex-col flex-1">
        <TopNavbar toggleSidebar={() => setCollapsed(!collapsed)} />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6 ml-[5%]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
