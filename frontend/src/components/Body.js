import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';

import Register from '../pages/Register';
import Login from '../pages/Login';
import Dashboard from "../pages/Dashboard";
import Projects from "../pages/Projects";
import Users from "../pages/Users";
import Activity from "../pages/Activity";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { connectSocket, disconnectSocket } from "../utils/socket";


// 🔹 Layout for protected pages
const MainLayout = () => {

  // socket only makes sense once the user is authenticated (this layout
  // is only reached for logged-in routes) - connect once here so every
  // child page can just add its own event listeners.
  useEffect(() => {
    connectSocket();
    return () => disconnectSocket();
  }, []);

  return (
    <div className="flex h-screen">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <Navbar />
        <div className="p-6 overflow-auto bg-gray-50 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const Body = () => {

  const appRouter = createBrowserRouter([
    
    // 🔹 Auth Routes (No sidebar)
    {
      path: "/login",
      element: <Login/>
    },
    {
      path: "/register",
      element: <Register/>
    },

    // 🔹 Main App Routes (Protected Layout)
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: "projects", element: <Projects /> },
        { path: "users", element: <Users /> },
        { path: "activity", element: <Activity /> }   // 🔥 NEW ROUTE
      ]
    }
  ]);

  return (
    <RouterProvider router={appRouter}/>
  )
}

export default Body;
