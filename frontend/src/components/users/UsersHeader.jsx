const UsersHeader = ({ setShowModal }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Users</h1>
        <p className="text-gray-500 mt-1">
          Manage users inside your tenant workspace
        </p>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        + Add User
      </button>
    </div>
  );
};

export default UsersHeader;