import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  fetchProjects,
  createProject,
  deleteProject,
  updateProjectStatus,
  projectCreatedFromSocket,
  projectUpdatedFromSocket,
  projectDeletedFromSocket,
  selectProjects,
  selectProjectsStatus,
  selectProjectsPagination,
} from "../features/projects/projectsSlice";
import { selectRole } from "../features/auth/authSlice";

import ProjectsHeader from "../components/projects/ProjectsHeader";
import ProjectsTable from "../components/projects/ProjectsTable";
import CreateProjectModal from "../components/projects/CreateProjectModal";
import Pagination from "../components/common/Pagination";
import { socket } from "../utils/socket";

const Projects = () => {

  const dispatch = useDispatch();
  const projects = useSelector(selectProjects);
  const status = useSelector(selectProjectsStatus);
  const pagination = useSelector(selectProjectsPagination);
  const role = useSelector(selectRole); // now comes from the shared /me fetch, not a local one

  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  useEffect(() => {
    dispatch(fetchProjects(page));
  }, [dispatch, page]);

  // 🔴 Live updates - reflect changes made by other users in this tenant
  // in real time without requiring a manual refresh. The slice reducers
  // decide whether to splice the update in (e.g. only page 1 for creates).
  useEffect(() => {
    const handleCreated = (project) => dispatch(projectCreatedFromSocket(project));
    const handleUpdated = (project) => dispatch(projectUpdatedFromSocket(project));
    const handleDeleted = (payload) => dispatch(projectDeletedFromSocket(payload));

    socket.on("project:created", handleCreated);
    socket.on("project:updated", handleUpdated);
    socket.on("project:deleted", handleDeleted);

    return () => {
      socket.off("project:created", handleCreated);
      socket.off("project:updated", handleUpdated);
      socket.off("project:deleted", handleDeleted);
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();

    const result = await dispatch(createProject(formData));

    if (createProject.fulfilled.match(result)) {
      toast.success(result.payload);
      // the socket "project:created" listener above will also add it, so
      // just close the modal here; no local state mutation to avoid dupes
      setShowModal(false);
      setFormData({ name: "", description: "" });
    } else {
      toast.error(result.payload || "Failed to create project");
    }
  };

  const handleDeleteProject = async (projectId) => {
    const result = await dispatch(deleteProject(projectId));

    if (deleteProject.fulfilled.match(result)) {
      toast.success(result.payload);
      // socket "project:deleted" listener will also remove it from state
    } else {
      toast.error("Failed to delete project");
    }
  };

  const handleStatusChange = async (projectId, newStatus) => {
    const result = await dispatch(updateProjectStatus({ projectId, status: newStatus }));

    if (updateProjectStatus.fulfilled.match(result)) {
      toast.success(result.payload);
      // socket "project:updated" listener will also sync this row
    } else {
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
        loading={status === "loading"}
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