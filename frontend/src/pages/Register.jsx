import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import { USER_API_END_POINT } from '../utils/Constant';
import toast from "react-hot-toast";

const Register = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const getInputData = async(e) => {
    e.preventDefault();
    setLoading(true);

    const user = {name, email, password, companyName};

    try {
      const res = await axios.post(`${USER_API_END_POINT}/register`, user, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      if(res.data.success){
        toast.success(res?.data?.message);
        navigate("/login");
      }

    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex">

      {/* 🔹 Left Branding Section */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white items-center justify-center p-12">
        <div>
          <h1 className="text-4xl font-bold mb-4">
            Create Your Workspace
          </h1>
          <p className="text-lg opacity-90">
            Start managing tenants, projects, and teams efficiently.
          </p>
        </div>
      </div>

      {/* 🔹 Right Register Section */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-gray-100 px-6">

        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">

          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Create Account 🚀
          </h2>

          <form onSubmit={getInputData} className="space-y-5">

            {/* Company Name */}
            <div>
              <label className="text-gray-600 text-sm">Company Name</label>
              <input
                value={companyName}
                onChange={(e)=>setCompanyName(e.target.value)}
                type="text"
                placeholder="Enter company name"
                className="w-full mt-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Name */}
            <div>
              <label className="text-gray-600 text-sm">Full Name</label>
              <input
                value={name}
                onChange={(e)=>setName(e.target.value)}
                type="text"
                placeholder="Enter your name"
                className="w-full mt-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

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
                  placeholder="Create a password"
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

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white font-semibold transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            {/* Login Redirect */}
            <p className="text-center text-gray-600 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                Login
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  )
}

export default Register;
