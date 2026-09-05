export const ProjectRow = ({
  project,
  role,
  handleDeleteProject,
  handleStatusChange,
  getStatusStyle,
  onOpenMembers
}) => {
  return (
    <tr className="hover:bg-gray-50 transition">
      <td className="px-6 py-4 font-medium text-gray-800">{project.name}</td>

      <td className="px-6 py-4 text-gray-600">{project.description}</td>

      <td className="px-6 py-4">
        {role === "OWNER" || role === "ADMIN" || role === "MEMBER" ? (
          <select
            value={project.status}
            onChange={(e) => handleStatusChange(project._id, e.target.value)}
            className="border px-2 py-1 rounded text-sm bg-white"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
        ) : (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
              project.status
            )}`}
          >
            {project.status}
          </span>
        )}
      </td>

      <td className="px-6 py-4 text-right space-x-3">
        {/* Manage Team Members Button (Available for all allowed roles) */}
        <button
          onClick={onOpenMembers}
          className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-medium transition"
        >
          Manage Team
        </button>

        {/* Delete button only for OWNER or ADMIN */}
        {(role === "OWNER" || role === "ADMIN") && (
          <button
            onClick={() => handleDeleteProject(project._id)}
            className="text-red-600 hover:text-red-800 text-xs font-medium"
          >
            Delete
          </button>
        )}
      </td>
    </tr>
  );
};

export default ProjectRow