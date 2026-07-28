import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { USER_API_END_POINT } from "../utils/Constant";

import UsersHeader from "../components/users/UsersHeader";
import UsersTable from "../components/users/UsersTable";
import CreateUserModal from "../components/users/CreateUserModal";

const Users = () => {

  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "MEMBER"
  });

  // 🔥 Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${USER_API_END_POINT}/getUsers`,
        {
          withCredentials: true,
        }
      );

      // If backend returns only array
      setUsers(res.data);

      // If backend returns { success: true, users: [...] }
      // setUsers(res.data.users);

    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${USER_API_END_POINT}/createUsers`,
        formData,
        { withCredentials: true }
      );

      toast.success(res.data.message);

      // Add newly created user to table
      setUsers(prev => [...prev, res.data.user]);

      setShowModal(false);

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "MEMBER"
      });

    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create user");
    }
  };

  return (
    <div className="space-y-6">

      <UsersHeader setShowModal={setShowModal} />

      <UsersTable users={users} />

      <CreateUserModal
        showModal={showModal}
        setShowModal={setShowModal}
        formData={formData}
        handleChange={handleChange}
        handleCreateUser={handleCreateUser}
      />

    </div>
  );
};

export default Users;