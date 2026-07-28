const RecentActivity = ({ projects }) => {

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

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
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Recent Activity
      </h2>

      {recentProjects.length === 0 ? (
        <p className="text-gray-400">No recent activity</p>
      ) : (
        <ul className="space-y-3">
          {recentProjects.map((project) => (
            <li
              key={project._id}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {project.name}
                </p>
                <p className="text-sm text-gray-500">
                  Created on {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(project.status)}`}
              >
                {project.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentActivity;