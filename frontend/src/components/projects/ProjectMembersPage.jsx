// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { PROJECT_MEMBER_API_END_POINT } from "../../utils/Constant";

// const ProjectMembersPage = ({ projectId, onClose, currentUser }) => {
//   const [members, setMembers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // State for the "Assign User" form
//   const [showAssignForm, setShowAssignForm] = useState(false);
//   const [userIdInput, setUserIdInput] = useState("");
//   const [roleInput, setRoleInput] = useState("MEMBER");
//   const [actionLoading, setActionLoading] = useState(false);

//   // Fetch project members when component mounts or projectId changes
//   const fetchMembers = async () => {
//     if (!projectId) return;
//     try {
//       setLoading(true);
//       const response = await axios.get(
//         `${PROJECT_MEMBER_API_END_POINT}/${projectId}/members`,
//         { withCredentials: true }
//       );
//       if (response.data.success) {
//         setMembers(response.data.members);
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Failed to fetch members");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMembers();
//   }, [projectId]);

//   // Handle Assign User
//   const handleAssignUser = async (e) => {
//     e.preventDefault();
//     if (!userIdInput) return;

//     try {
//       setActionLoading(true);
//       const response = await axios.post(
//         `${PROJECT_MEMBER_API_END_POINT}/assign-user`,
//         {
//           projectId,
//           userId: userIdInput.trim(),
//           role: roleInput,
//         },
//         { withCredentials: true }
//       );

//       if (response.data.success) {
//         toast.success(response.data.message || "User assigned successfully!");
//         setUserIdInput("");
//         setRoleInput("MEMBER");
//         setShowAssignForm(false);
//         fetchMembers(); // Refresh member list
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Failed to assign user");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // Handle Remove User
//   const handleRemoveUser = async (userId) => {
//     if (!window.confirm("Are you sure you want to remove this user from the project?")) {
//       return;
//     }

//     try {
//       const response = await axios.delete(
//         `${PROJECT_MEMBER_API_END_POINT}/remove-user`,
//         {
//           data: { projectId, userId },
//           withCredentials: true,
//         }
//       );

//       if (response.data.success) {
//         toast.success(response.data.message || "User removed successfully!");
//         fetchMembers(); // Refresh member list
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Failed to remove user");
//     }
//   };

//   if (!projectId) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 scale-100">
        
//         {/* Modal Header */}
//         <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
//           <div>
//             <h2 className="text-xl font-bold text-gray-800">Project Team</h2>
//             <p className="text-xs text-gray-500">Manage members for Project ID: {projectId}</p>
//           </div>
//           <button 
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//             </svg>
//           </button>
//         </div>

//         {/* Modal Body */}
//         <div className="p-6 flex-grow overflow-y-auto">
//           <div className="mb-4 flex justify-end">
//             <button
//               onClick={() => setShowAssignForm(!showAssignForm)}
//               className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow transition"
//             >
//               {showAssignForm ? "Cancel Adding" : "+ Add New Member"}
//             </button>
//           </div>

//           {/* Inline Assign User Form */}
//           {showAssignForm && (
//             <div className="mb-6 p-4 border border-gray-200 bg-gray-50 rounded-lg shadow-inner">
//               <h3 className="text-lg font-semibold text-gray-800 mb-3">Assign New User</h3>
//               <form onSubmit={handleAssignUser} className="flex flex-col md:flex-row gap-4 items-end">
//                 <div className="flex-grow w-full">
//                   <label className="block text-xs font-medium text-gray-600 mb-1">User ID (MongoDB ObjectID)</label>
//                   <input
//                     type="text"
//                     value={userIdInput}
//                     onChange={(e) => setUserIdInput(e.target.value)}
//                     placeholder="e.g. 507f1f77bcf86cd799439011"
//                     required
//                     className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
//                   />
//                 </div>
//                 <div className="w-full md:w-1/4">
//                   <label className="block text-xs font-medium text-gray-600 mb-1">Project Role</label>
//                   <select
//                     value={roleInput}
//                     onChange={(e) => setRoleInput(e.target.value)}
//                     className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none bg-white"
//                   >
//                     <option value="MEMBER">MEMBER</option>
//                     <option value="MANAGER">MANAGER</option>
//                   </select>
//                 </div>
//                 <button
//                   type="submit"
//                   disabled={actionLoading}
//                   className="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition disabled:opacity-50"
//                 >
//                   {actionLoading ? "Assigning..." : "Grant Access"}
//                 </button>
//               </form>
//             </div>
//           )}

//           {/* Members Table */}
//           <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
//             {loading ? (
//               <div className="p-10 text-center text-gray-500">Loading team members...</div>
//             ) : members.length === 0 ? (
//               <div className="p-10 text-center text-gray-400">No members found for this project.</div>
//             ) : (
//               <table className="min-w-full text-sm text-left">
//                 <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
//                   <tr>
//                     <th className="px-6 py-3">Name</th>
//                     <th className="px-6 py-3">Email</th>
//                     <th className="px-6 py-3">Project Role</th>
//                     <th className="px-6 py-3 text-right">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {members.map((member) => (
//                     <tr key={member._id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 font-medium text-gray-900">
//                         {member.userId?.name || "Unknown User"}
//                       </td>
//                       <td className="px-6 py-4 text-gray-600">
//                         {member.userId?.email || "N/A"}
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
//                           member.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
//                         }`}>
//                           {member.role}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-right">
//                         <button
//                           onClick={() => handleRemoveUser(member.userId?._id)}
//                           className="text-red-600 hover:text-red-800 text-xs font-medium"
//                         >
//                           Remove
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>
//         </div>

//         {/* Modal Footer */}
//         <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex justify-end">
//             <button 
//                 onClick={onClose}
//                 className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
//             >
//                 Close Window
//             </button>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default ProjectMembersPage;








import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { PROJECT_MEMBER_API_END_POINT, TASK_API_END_POINT } from "../../utils/Constant";
import CreateTaskModal from "./CreateTaskModel";

// Internal Modal Component for Assigning Tasks

const ProjectMembersPage = ({ projectId, onClose }) => {
  const [activeTab, setActiveTab] = useState("members"); // "members" or "tasks"
  
  // Members state
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [userIdInput, setUserIdInput] = useState("");
  const [roleInput, setRoleInput] = useState("MEMBER");
  const [actionLoading, setActionLoading] = useState(false);

  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Check if current logged-in user is a Manager in this project
  const [isManager, setIsManager] = useState(false);

  // Fetch project members
  const fetchMembers = async () => {
    if (!projectId) return;
    try {
      setLoadingMembers(true);
      const response = await axios.get(
        `${PROJECT_MEMBER_API_END_POINT}/${projectId}/members`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setMembers(response.data.members);
        
        // Determine if current user has MANAGER role in project members list
        // (Assuming backend returns current user context or you check against active userId)
        const currentUserMember = response.data.members.find(
          (m) => m.role === "MANAGER" // Adjust based on how backend responds with logged user info
        );
        if (currentUserMember) {
          setIsManager(true);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch members");
    } finally {
      setLoadingMembers(false);
    }
  };

  // Fetch project tasks
  const fetchTasks = async () => {
    if (!projectId) return;
    try {
      setLoadingTasks(true);
      const response = await axios.get(
        `${TASK_API_END_POINT}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        const projectTasks = response.data.tasks.filter(
          (t) => t.projectId?._id === projectId || t.projectId === projectId
        );
        setTasks(projectTasks);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchTasks();
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
        fetchMembers();
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
        fetchMembers();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to remove user");
    }
  };

  // Handle Delete Task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `${TASK_API_END_POINT}/${taskId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Task deleted successfully!");
        fetchTasks(); // Refresh tasks list
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete task");
    }
  };

  // Handle Quick Status Update PATCH (matches updateTaskStatus backend route)
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await axios.patch(
        `${TASK_API_END_POINT}/${taskId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Task status updated!");
        fetchTasks();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  if (!projectId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Project Management Hub</h2>
            <p className="text-xs text-gray-500">Project ID: {projectId}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Tab Switcher & Actions Bar */}
        <div className="px-6 pt-4 pb-2 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("members")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                activeTab === "members"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Team Members ({members.length})
            </button>
            <button
              onClick={() => setActiveTab("tasks")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                activeTab === "tasks"
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Project Tasks ({tasks.length})
            </button>
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            {activeTab === "members" ? (
              <button
                onClick={() => setShowAssignForm(!showAssignForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow transition"
              >
                {showAssignForm ? "Cancel Adding" : "+ Add New Member"}
              </button>
            ) : (
              <button
                onClick={() => setShowTaskModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow transition"
              >
                + Assign Task
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-grow overflow-y-auto bg-gray-50">
          
          {/* MEMBERS TAB CONTENT */}
          {activeTab === "members" && (
            <div>
              {showAssignForm && (
                <div className="mb-6 p-4 border border-gray-200 bg-white rounded-lg shadow-sm">
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

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                {loadingMembers ? (
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
                              member.role === 'MANAGER' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
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
          )}

          {/* TASKS TAB CONTENT */}
          {activeTab === "tasks" && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              {loadingTasks ? (
                <div className="p-10 text-center text-gray-500">Loading project tasks...</div>
              ) : tasks.length === 0 ? (
                <div className="p-10 text-center text-gray-400">No tasks created for this project yet.</div>
              ) : (
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                    <tr>
                      <th className="px-6 py-3">Title</th>
                      <th className="px-6 py-3">Assigned To</th>
                      <th className="px-6 py-3">Priority</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Due Date</th>
                      <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {tasks.map((task) => (
                      <tr key={task._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {task.title}
                          <p className="text-xs text-gray-500 font-normal truncate max-w-xs">{task.description}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {task.assignedTo?.name || "Unassigned"}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            task.priority === 'HIGH' || task.priority === 'URGENT' 
                              ? 'bg-red-100 text-red-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {/* Interactive status dropdown supporting backend allowed statuses: TODO, IN_PROGRESS, DONE */}
                          <select
                            value={task.status || "TODO"}
                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                            className="text-xs border border-gray-300 rounded p-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="TODO">TODO</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="DONE">DONE</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Due Date"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="text-red-600 hover:text-red-800 text-xs font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

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

      {/* Task Creation Modal Render */}
      {showTaskModal && (
        <CreateTaskModal
          projectId={projectId}
          members={members}
          onClose={() => setShowTaskModal(false)}
          onTaskCreated={fetchTasks}
        />
      )}
    </div>
  );
};

export default ProjectMembersPage;