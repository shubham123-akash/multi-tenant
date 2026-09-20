import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { fetchUsers, createUser, selectUsers } from "../features/users/usersSlice";

import UsersHeader from "../components/users/UsersHeader";
import UsersTable from "../components/users/UsersTable";
import CreateUserModal from "../components/users/CreateUserModal";

const Users = () => {

  const dispatch = useDispatch();
  const users = useSelector(selectUsers);

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "MEMBER"
  });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    const result = await dispatch(createUser(formData));

    if (createUser.fulfilled.match(result)) {
      toast.success(result.payload.message);
      // reducer already pushed result.payload.user into the slice
      setShowModal(false);
      setFormData({ name: "", email: "", password: "", role: "MEMBER" });
    } else {
      toast.error(result.payload || "Failed to create user");
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