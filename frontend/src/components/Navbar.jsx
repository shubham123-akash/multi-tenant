import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchTenantInfo, selectTenant } from "../features/tenant/tenantSlice";
import { logoutUser } from "../features/auth/authSlice";

const Navbar = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tenant = useSelector(selectTenant);

  useEffect(() => {
    // only fetched here now — Dashboard.jsx reads the same slice instead
    // of firing its own request
    dispatch(fetchTenantInfo());
  }, [dispatch]);

  const handleLogout = async () => {
    const result = await dispatch(logoutUser());

    if (logoutUser.fulfilled.match(result)) {
      toast.success(result.payload.message);
      navigate("/login");
    } else {
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
          {tenant ? `welcome to , ${tenant.name}` : "Loading..."}
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