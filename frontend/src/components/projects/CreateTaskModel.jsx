import React, { useState } from "react";

import axiosInstance from "../../utils/axiosInstance";

import toast from "react-hot-toast";

import { TASK_API_END_POINT } from "../../utils/Constant";



const CreateTaskModal = ({ projectId, members, onClose, onTaskCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [estimatedHours, setEstimatedHours] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !assignedTo) {
      toast.error("Title and Assigned Member are required.");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `${TASK_API_END_POINT}/create`,
        {
          title,
          description,
          projectId,
          assignedTo,
          priority,
          dueDate,
          estimatedHours: Number(estimatedHours) || 0,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(response.data.message || "Task created successfully!");
        onTaskCreated(); // Refresh tasks list
        onClose();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800">Assign Task to Member</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Task Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Implement login validation"
              required
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide task details..."
              rows="3"
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Assign To Member *</label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">Select project member...</option>
              {members.map((member) => (
                <option key={member.userId?._id} value={member.userId?._id}>
                  {member.userId?.name} ({member.userId?.email}) - [{member.role}]
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Estimated Hours</label>
              <input
                type="number"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                placeholder="e.g., 5"
                min="0"
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Creating Task..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};



export default CreateTaskModal;