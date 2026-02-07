import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext.jsx";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      login(data.token);
      navigate("/dashboard");
    } else {
      alert(data.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#747bff26] flex items-center justify-center px-4">
      <div className=" max-w-md bg-white rounded-xl shadow-sm border p-8 pr-[5px] w-[50%]">
        
        {/* Heading */}
        <h1 className="text-3xl font-serif font-semibold mb-2 text-center">
          Log in
        </h1>
        <p className="text-sm text-gray-600 mb-6 flex flex-col text-center">
          Need a SkillTrack account?{" "}
          <span className="text-blue-600 cursor-pointer hover:underline">
            Create an account
          </span>
        </p>

        {/* Form */}
        <form onSubmit={submit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Username or Email
            </label>
            <input
              type="email"
              required
              value={email}
              placeholder="Enter your email.."
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#4c55fa3d] border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-[5vh]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1 flex justify-between">
              Password
              <span
                className="flex items-center gap-1 text-blue-600 text-sm cursor-pointer"
                onClick={() => setShow(!show)}
              >
                {show ? <FaEyeSlash /> : <FaEye />}
                {show ? "Hide" : "Show"}
              </span>
            </label>
            <input
              type={show ? "text" : "password"}
              required
              value={password}
              placeholder="Enter your password.."
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#4c55fa3d] border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-[5vh]"
            />
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-2">
            <input type="checkbox" className="w-4 h-4" />
            <span className="text-sm">Keep me logged in</span>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-teal-700 text-white py-3 rounded-full hover:bg-teal-800 transition font-medium"
          >
            Log in
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-6 text-sm text-blue-600 flex flex-wrap gap-4">
          <span className="cursor-pointer hover:underline">
            Forgot password?
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
