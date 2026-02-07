import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/Authcontext";
import Login from "./pages/Login";
import React from 'react'
import Dashboard from "./pages/Dashboard";
import Skills from "./pages/Skillpage";
import Applications from "./pages/Applications";
import ResumeAi from "./pages/ResumeAi";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import Billing from "./pages/Billing";

function App() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Protected Dashboard */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/resume" element={<ResumeAi />} />
        <Route path="/billing" element={<Billing />} />
      </Route>

      {/* Default */}
      <Route
        path="/"
        element={<Navigate to={user ? "/dashboard" : "/login"} />}
      />
    </Routes>
  );
}

export default App;
