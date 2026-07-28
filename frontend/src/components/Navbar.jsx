import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { USER_API_END_POINT, TENANT_API_END_POINT } from "../utils/Constant";

const Navbar = () => {

  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");

  // 🔥 Fetch Tenant Info
  const fetchTenant = async () => {
    try {
      const res = await axios.get(
        `${TENANT_API_END_POINT}/getTenantInfo`,
        { withCredentials: true }
      );

      console.log("Tenant Response:", res.data);

      setCompanyName(res.data.name);

    } catch (error) {
      console.log("Failed to load tenant info");
    }
  };

  useEffect(() => {
    fetchTenant();
  }, []);

  const handleLogout = async () => {
    try {

      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }

    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      
      <h1 className="text-xl font-semibold text-gray-700">
        Dashboard
      </h1>

      <div className="flex items-center gap-4">

        {/* 🔹 Company Name */}
        <span className="text-gray-600 text-sm font-medium">
          {companyName ? `welcome to , ${companyName}` : "Loading..."}
        </span>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default Navbar;
