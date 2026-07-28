import ProjectRow from "./ProjectRow";

const ProjectsTable = ({
  projects,
  loading,
  role,
  handleDeleteProject,
  handleStatusChange,
  getStatusStyle
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">

      {loading ? (
        <div className="p-6 text-center text-gray-500">
          Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="p-6 text-center text-gray-400">
          No projects found
        </div>
      ) : (
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Project Name</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Status</th>
              {(role === "OWNER" || role === "ADMIN") && (
                <th className="px-6 py-3 text-right">Actions</th>
              )}
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
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProjectsTable;