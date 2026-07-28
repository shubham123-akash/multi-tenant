import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white">

      {/* 🔹 Navbar */}
      <div className="flex justify-between items-center px-8 py-6">
        <h1 className="text-2xl font-bold">MultiTenant SaaS</h1>

        <div className="space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 bg-white text-indigo-700 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-indigo-700 transition"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* 🔹 Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 mt-20">

        <h2 className="text-5xl font-bold mb-6 leading-tight">
          Manage Tenants, Projects & Teams <br />
          In One Powerful Platform
        </h2>

        <p className="text-lg opacity-90 max-w-2xl mb-8">
          A scalable multi-tenant SaaS solution built with MERN stack.
          Simplify project management, user access, and collaboration.
        </p>

        <div className="space-x-4">
          <Link
            to="/register"
            className="px-6 py-3 bg-white text-indigo-700 font-semibold rounded-lg shadow-lg hover:scale-105 transition"
          >
            Start Free Trial
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 border border-white rounded-lg hover:bg-white hover:text-indigo-700 transition"
          >
            Login
          </Link>
        </div>

      </div>

      {/* 🔹 Features Section */}
      <div className="mt-32 px-8 pb-20 grid md:grid-cols-3 gap-8 text-center">

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-3">Multi-Tenant Architecture</h3>
          <p className="opacity-90">
            Securely isolate tenants with scalable architecture design.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-3">Project Management</h3>
          <p className="opacity-90">
            Organize and manage projects efficiently across teams.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-3">Role-Based Access</h3>
          <p className="opacity-90">
            Admin and user roles with secure permission control.
          </p>
        </div>

      </div>

      {/* 🔹 Footer */}
      <div className="text-center py-6 border-t border-white/20 opacity-80">
        © {new Date().getFullYear()} MultiTenant SaaS. All rights reserved.
      </div>

    </div>
  );
};

export default HomePage;
