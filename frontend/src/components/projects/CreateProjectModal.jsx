const CreateProjectModal = ({
  showModal,
  setShowModal,
  handleCreateProject,
  formData,
  handleChange
}) => {

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">

        <h2 className="text-xl font-semibold mb-4">
          Create New Project
        </h2>

        <form onSubmit={handleCreateProject} className="space-y-4">

          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Project Name"
            className="w-full px-3 py-2 border rounded-lg"
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Project Description"
            className="w-full px-3 py-2 border rounded-lg"
            rows="3"
            required
          />

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Create
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;