import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { PROJECT_MEMBER_API_END_POINT } from "../../utils/Constant";

const ProjectMembersPage = ({ projectId, onClose, currentUser }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for the "Assign User" form
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [userIdInput, setUserIdInput] = useState("");
  const [roleInput, setRoleInput] = useState("MEMBER");
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch project members when component mounts or projectId changes
  const fetchMembers = async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const response = await axios.get(
        `${PROJECT_MEMBER_API_END_POINT}/${projectId}/members`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setMembers(response.data.members);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [projectId]);

  // Handle Assign User
  const handleAssignUser = async (e) => {
    e.preventDefault();
    if (!userIdInput) return;

    try {
      setActionLoading(true);
      const response = await axios.post(
        `${PROJECT_MEMBER_API_END_POINT}/assign-user`,
        {
          projectId,
          userId: userIdInput.trim(),
          role: roleInput,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message || "User assigned successfully!");
        setUserIdInput("");
        setRoleInput("MEMBER");
        setShowAssignForm(false);
        fetchMembers(); // Refresh member list
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to assign user");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Remove User
  const handleRemoveUser = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this user from the project?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `${PROJECT_MEMBER_API_END_POINT}/remove-user`,
        {
          data: { projectId, userId },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message || "User removed successfully!");
        fetchMembers(); // Refresh member list
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to remove user");
    }
  };

  if (!projectId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 scale-100">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Project Team</h2>
            <p className="text-xs text-gray-500">Manage members for Project ID: {projectId}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-grow overflow-y-auto">
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => setShowAssignForm(!showAssignForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow transition"
            >
              {showAssignForm ? "Cancel Adding" : "+ Add New Member"}
            </button>
          </div>

          {/* Inline Assign User Form */}
          {showAssignForm && (
            <div className="mb-6 p-4 border border-gray-200 bg-gray-50 rounded-lg shadow-inner">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Assign New User</h3>
              <form onSubmit={handleAssignUser} className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-grow w-full">
                  <label className="block text-xs font-medium text-gray-600 mb-1">User ID (MongoDB ObjectID)</label>
                  <input
                    type="text"
                    value={userIdInput}
                    onChange={(e) => setUserIdInput(e.target.value)}
                    placeholder="e.g. 507f1f77bcf86cd799439011"
                    required
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="w-full md:w-1/4">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Project Role</label>
                  <select
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="MEMBER">MEMBER</option>
                    <option value="MANAGER">MANAGER</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition disabled:opacity-50"
                >
                  {actionLoading ? "Assigning..." : "Grant Access"}
                </button>
              </form>
            </div>
          )}

          {/* Members Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-10 text-center text-gray-500">Loading team members...</div>
            ) : members.length === 0 ? (
              <div className="p-10 text-center text-gray-400">No members found for this project.</div>
            ) : (
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Project Role</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {members.map((member) => (
                    <tr key={member._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {member.userId?.name || "Unknown User"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {member.userId?.email || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          member.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleRemoveUser(member.userId?._id)}
                          className="text-red-600 hover:text-red-800 text-xs font-medium"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex justify-end">
            <button 
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
            >
                Close Window
            </button>
        </div>

      </div>
    </div>
  );
};

export default ProjectMembersPage;