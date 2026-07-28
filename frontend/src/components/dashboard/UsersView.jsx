const UsersView = ({ users }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        All Users ({users.length})
      </h2>

      {users.length === 0 ? (
        <p className="text-gray-400">No users found</p>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex justify-between border-b pb-2"
            >
              <div>
                <p className="font-medium text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <span className="text-sm font-semibold text-indigo-600">
                {user.role}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersView;