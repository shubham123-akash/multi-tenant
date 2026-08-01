import React, { useState } from "react";
import ProjectMembersPage from "./ProjectMembersPage";
import ProjectRow from "./ProjectRow";

const ProjectsTable = ({
  projects,
  loading,
  role, // <-- This is the logged-in user's role (e.g. "OWNER" or "ADMIN")
  handleDeleteProject,
  handleStatusChange,
  getStatusStyle
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {loading ? (
        <div className="p-6 text-center text-gray-500">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="p-6 text-center text-gray-400">No projects found</div>
      ) : (
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Project Name</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Team / Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {projects.map((project) => (
              <ProjectRow
                key={project._id}
                project={project}
                role={role}
                handleDeleteProject={handleDeleteProject}
                handleStatusChange={handleStatusChange}
                getStatusStyle={getStatusStyle}
                onOpenMembers={() => setSelectedProjectId(project._id)}
              />
            ))}
          </tbody>
        </table>
      )}

      {/* Pass role as currentUser to ProjectMembersPage */}
      {selectedProjectId && (
        <ProjectMembersPage
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
          currentUser={{ role }} 
        />
      )}
    </div>
  );
};

export default ProjectsTable;