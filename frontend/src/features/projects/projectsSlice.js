import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { PROJECT_API_END_POINT } from "../../utils/Constant";

export const fetchProjects = createAsyncThunk(
  "projects/fetchAll",
  async (targetPage = 1, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`${PROJECT_API_END_POINT}/getAllProjects`, {
        params: { page: targetPage, limit: 10 },
      });
      return { ...res.data, page: targetPage };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch projects");
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`${PROJECT_API_END_POINT}/createProject`, formData);
      // the new project itself arrives via the "project:created" socket
      // event (see projectCreated reducer below), so we only need the
      // success message here
      return res.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create project");
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`${PROJECT_API_END_POINT}/deleteProject/${projectId}`);
      // removal is also reflected via the "project:deleted" socket event
      return res.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete project");
    }
  }
);

export const updateProjectStatus = createAsyncThunk(
  "projects/updateStatus",
  async ({ projectId, status }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`${PROJECT_API_END_POINT}/updateStatus/${projectId}`, { status });
      return res.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update status");
    }
  }
);

const initialState = {
  items: [],
  pagination: null,
  page: 1,
  status: "idle",   // list fetch status
  error: null,
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    // Dispatched from the socket listeners set up in the Projects page.
    // Kept as plain reducers (not thunks) since they just react to
    // server-pushed events, no request to make.
    projectCreatedFromSocket: (state, action) => {
      if (state.page === 1) {
        state.items = [action.payload, ...state.items].slice(0, 10);
      }
    },
    projectUpdatedFromSocket: (state, action) => {
      state.items = state.items.map((p) =>
        p._id === action.payload._id ? action.payload : p
      );
    },
    projectDeletedFromSocket: (state, action) => {
      state.items = state.items.filter((p) => p._id !== action.payload.projectId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.projects;
        state.pagination = action.payload.pagination ?? state.pagination;
        state.page = action.payload.page;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  projectCreatedFromSocket,
  projectUpdatedFromSocket,
  projectDeletedFromSocket,
} = projectsSlice.actions;

export const selectProjects = (state) => state.projects.items;
export const selectProjectsStatus = (state) => state.projects.status;
export const selectProjectsPagination = (state) => state.projects.pagination;
export const selectProjectsPage = (state) => state.projects.page;

export default projectsSlice.reducer;