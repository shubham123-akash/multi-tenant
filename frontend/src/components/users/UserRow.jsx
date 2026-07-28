const UserRow = ({ user }) => {

  const getRoleStyle = (role) => {
    switch (role) {
      case "MEMBER":
        return "bg-purple-100 text-purple-600";
      case "ADMIN":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-green-100 text-green-600";
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition">
      <td className="px-6 py-4 font-medium text-gray-800">
        {user.name}
      </td>

      <td className="px-6 py-4 text-gray-600">
        {user.email}
      </td>

      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleStyle(user.role)}`}
        >
          {user.role}
        </span>
      </td>
    </tr>
  );
};

export default UserRow;