import UserRow from "./UserRow";

const UsersTable = ({ users }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">

      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Role</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {users.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center py-6 text-gray-400">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <UserRow key={user._id} user={user} />
            ))
          )}
        </tbody>

      </table>

    </div>
  );
};

export default UsersTable;