import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { PROJECT_API_END_POINT, USER_API_END_POINT } from "../utils/Constant";

import ProjectsHeader from "../components/projects/ProjectsHeader";
import ProjectsTable from "../components/projects/ProjectsTable";
import CreateProjectModal from "../components/projects/CreateProjectModal";

const Projects = () => {

  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const fetchUser = async () => {
    try {
      const res = await axios.get(
        `${USER_API_END_POINT}/me`,
        { withCredentials: true }
      );
      setRole(res.data.role);
    } catch (error) {
      console.log("Failed to fetch user role");
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${PROJECT_API_END_POINT}/getAllProjects`,
        { withCredentials: true }
      );
      setProjects(res.data.projects);
    } catch (error) {
      toast.error("Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${PROJECT_API_END_POINT}/createProject`,
        formData,
        { withCredentials: true }
      );

      toast.success(res.data.message);
      setProjects([...projects, res.data.project]);
      setShowModal(false);
      setFormData({ name: "", description: "" });

    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create project");
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const res = await axios.delete(
        `${PROJECT_API_END_POINT}/deleteProject/${projectId}`,
        { withCredentials: true }
      );

      toast.success(res.data.message);
      setProjects(projects.filter(p => p._id !== projectId));

    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      const res = await axios.patch(
        `${PROJECT_API_END_POINT}/updateStatus/${projectId}`,
        { status: newStatus },
        { withCredentials: true }
      );

      toast.success(res.data.message);

      setProjects(prev =>
        prev.map(p =>
          p._id === projectId ? res.data.project : p
        )
      );

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