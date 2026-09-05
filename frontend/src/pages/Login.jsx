import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from "../utils/axiosInstance";
import { USER_API_END_POINT } from '../utils/Constant';
import toast from "react-hot-toast";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const getInputData = async(e) => {
    e.preventDefault();
    setLoading(true);

    const user = {email, password};

    try {
      const res = await axiosInstance.post(`${USER_API_END_POINT}/login`, user, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      if(res.data.success){
        toast.success(res.data.message);
        navigate("/");
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex">

      {/* 🔹 Left Branding Section */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white items-center justify-center p-12">
        <div>
          <h1 className="text-4xl font-bold mb-4">
            Multi-Tenant SaaS Platform
          </h1>
          <p className="text-lg opacity-90">
            Manage projects, users and tenants seamlessly.
          </p>
        </div>
      </div>

      {/* 🔹 Right Login Section */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-gray-100 px-6">

        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">

          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Welcome Back 👋
          </h2>

          <form onSubmit={getInputData} className="space-y-5">

            {/* Email */}
            <div>
              <label className="text-gray-600 text-sm">Email</label>
              <input
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email"
                className="w-full mt-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-600 text-sm">Password</label>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full mt-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 cursor-pointer text-sm text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </span>
              </div>
            </div>

            {/* Tenant ID */}
            {/* <div>
              <label className="text-gray-600 text-sm">Tenant ID</label>
              <input
                value={tenantId}
                onChange={(e)=>setTenantId(e.target.value)}
                type="text"
                placeholder="Enter tenant ID"
                className="w-full mt-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div> */}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white font-semibold transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Signup */}
            <p className="text-center text-gray-600 text-sm">
              Don’t have an account?{" "}
              <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
                Signup
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;
