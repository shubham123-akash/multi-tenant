import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { PROJECT_API_END_POINT, USER_API_END_POINT } from "../utils/Constant";

import ProjectsHeader from "../components/projects/ProjectsHeader";
import ProjectsTable from "../components/projects/ProjectsTable";
import CreateProjectModal from "../components/projects/CreateProjectModal";
import Pagination from "../components/common/Pagination";
import { socket } from "../utils/socket";

const Projects = () => {

  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get(
        `${USER_API_END_POINT}/me`,
        { withCredentials: true }
      );
      setRole(res.data.role);
    } catch (error) {
      console.log("Failed to fetch user role");
    }
  };

  const fetchProjects = async (targetPage = 1) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `${PROJECT_API_END_POINT}/getAllProjects`,
        {
          params: { page: targetPage, limit: 10 },
          withCredentials: true
        }
      );
      setProjects(res.data.projects);
      // setPagination(res.data.pagination);
    } catch (error) {
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(page);
  }, [page]);

  useEffect(() => {
    fetchUser();
  }, []);

  // 🔴 Live updates - reflect changes made by other users in this tenant
  // in real time without requiring a manual refresh.
  useEffect(() => {
    const handleCreated = (project) => {
      // only splice into the currently viewed page if we're on page 1,
      // otherwise just let the counts update on next navigation
      if (page === 1) {
        setProjects(prev => [project, ...prev].slice(0, 10));
      }
      // setPagination(prev => prev ? { ...prev, totalItems: prev.totalItems + 1 } : prev);
    };

    const handleUpdated = (project) => {
      setProjects(prev => prev.map(p => (p._id === project._id ? project : p)));
    };

    const handleDeleted = ({ projectId }) => {
      setProjects(prev => prev.filter(p => p._id !== projectId));
    };

    socket.on("project:created", handleCreated);
    socket.on("project:updated", handleUpdated);
    socket.on("project:deleted", handleDeleted);

    return () => {
      socket.off("project:created", handleCreated);
      socket.off("project:updated", handleUpdated);
      socket.off("project:deleted", handleDeleted);
    };
  }, [page]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post(
        `${PROJECT_API_END_POINT}/createProject`,
        formData,
        { withCredentials: true }
      );

      toast.success(res.data.message);
      // the socket "project:created" listener above will also add it, so
      // just close the modal here; no local state mutation to avoid dupes
      setShowModal(false);
      setFormData({ name: "", description: "" });

    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create project");
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const res = await axiosInstance.delete(
        `${PROJECT_API_END_POINT}/deleteProject/${projectId}`,
        { withCredentials: true }
      );

      toast.success(res.data.message);
      // socket "project:deleted" listener will also remove it from state

    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      const res = await axiosInstance.patch(
        `${PROJECT_API_END_POINT}/updateStatus/${projectId}`,
        { status: newStatus },
        { withCredentials: true }
      );

      toast.success(res.data.message);
      // socket "project:updated" listener will also sync this row

    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-600";
      case "COMPLETED":
        return "bg-blue-100 text-blue-600";
      case "ARCHIVED":
        return "bg-gray-200 text-gray-600";
      default:
        return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <div className="space-y-6">

      <ProjectsHeader role={role} setShowModal={setShowModal} />

      <ProjectsTable
        projects={projects}
        loading={loading}
        role={role}
        handleDeleteProject={handleDeleteProject}
        handleStatusChange={handleStatusChange}
        getStatusStyle={getStatusStyle}
      />

      <Pagination pagination={pagination} onPageChange={setPage} />

      <CreateProjectModal
        showModal={showModal}
        setShowModal={setShowModal}
        handleCreateProject={handleCreateProject}
        formData={formData}
        handleChange={handleChange}
      />

    </div>
  );
};

export default Projects;