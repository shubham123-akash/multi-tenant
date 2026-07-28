const ProjectRow = ({
  project,
  role,
  handleDeleteProject,
  handleStatusChange,
  getStatusStyle
}) => {
  return (
    <tr className="hover:bg-gray-50 transition">

      <td className="px-6 py-4 font-medium text-gray-800">
        {project.name}
      </td>

      <td className="px-6 py-4 text-gray-600">
        {project.description}
      </td>

      <td className="px-6 py-4">
        {(role === "OWNER" || role === "ADMIN") ? (
          <select
            value={project.status}
            onChange={(e) =>
              handleStatusChange(project._id, e.target.value)
            }
            className="border px-2 py-1 rounded text-sm"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
        ) : (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(project.status)}`}
          >
            {project.status}
          </span>
        )}
      </td>

      {(role === "OWNER" || role === "ADMIN") && (
        <td className="px-6 py-4 text-right">
          <button
            onClick={() => handleDeleteProject(project._id)}
            className="text-red-600 hover:underline"
          >
            Delete
          </button>
        </td>
      )}

    </tr>
  );
};

export default ProjectRow;