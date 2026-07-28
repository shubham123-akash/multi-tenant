import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/Constant";

const Sidebar = () => {

  const location = useLocation();
  const [role, setRole] = useState("");

  // 🔥 Fetch user role
  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${USER_API_END_POINT}/me`,
        { withCredentials: true }
      );
      setRole(res.data.role);
    } catch (error) {
      console.log("Failed to fetch role");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // 🔹 Menu Items
  const menu = [
    { name: "Dashboard", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "Users", path: "/users" },

    // 🔥 Show Activity only for OWNER / ADMIN
    ...(role === "OWNER" || role === "ADMIN"
      ? [{ name: "Activity", path: "/activity" }]
      : [])
  ];

  return (
    <div className="w-64 bg-white shadow-lg p-6 hidden md:block">

      <h2 className="text-2xl font-bold text-indigo-600 mb-8">
        SaaS App
      </h2>

      <ul className="space-y-3">
        {menu.map((item) => {

          // Better active matching (important for nested routes)
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + "/");

          return (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`block px-4 py-2 rounded-lg transition 
                ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-indigo-100 text-gray-700"
                }`}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
