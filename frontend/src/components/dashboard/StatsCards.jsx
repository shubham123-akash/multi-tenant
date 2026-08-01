const StatsCards = ({
  users,
  projects,
  role,
  setView
}) => {

  const projectList = Array.isArray(projects) ? projects : [];

const activeProjects = projectList.filter(
    p => p.status === "ACTIVE"
);

const archivedProjects = projectList.filter(
    p => p.status === "ARCHIVED"
);

const completedProjects = projectList.filter(
    p => p.status === "COMPLETED"
);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

      {(role === "OWNER" || role === "ADMIN") && (
        <div
          onClick={() => setView("users")}
          className="bg-white p-6 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition"
        >
          <h2 className="text-gray-500 text-sm">Total Users</h2>
          <p className="text-2xl font-bold text-indigo-600 mt-2">
            {users.length}
          </p>
        </div>
      )}

      <div
        onClick={() => setView("projects")}
        className="bg-white p-6 rounded-xl shadow-md cursor-pointer hover:shadow-lg transition"
      >
        <h2 className="text-gray-500 text-sm">Total Projects</h2>
        <p className="text-2xl font-bold text-blue-600 mt-2">
          {projectList.length}
        </p>
      </div>

      <StatCard title="Active" value={activeProjects.length} color="text-green-600" />
      <StatCard title="Completed" value={completedProjects.length} color="text-blue-600" />
      <StatCard title="Archived" value={archivedProjects.length} color="text-gray-600" />

    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h2 className="text-gray-500 text-sm">{title}</h2>
    <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
  </div>
);

export default StatsCards;