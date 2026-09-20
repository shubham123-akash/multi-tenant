import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { ACTIVITY_API_END_POINT } from "../../utils/Constant";

export const fetchLogs = createAsyncThunk(
  "activity/fetchLogs",
  async (targetPage = 1, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`${ACTIVITY_API_END_POINT}/getLogs`, {
        params: { page: targetPage, limit: 20 },
      });
      return { ...res.data, page: targetPage };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch activity logs");
    }
  }
);

const initialState = {
  items: [],
  pagination: null,
  page: 1,
  status: "idle",
  error: null,
};

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    // dispatched from the "activity:new" socket listener
    logAddedFromSocket: (state, action) => {
      if (state.page === 1) {
        state.items = [action.payload, ...state.items].slice(0, 20);
      }
      if (state.pagination) {
        state.pagination.totalItems += 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.logs;
        state.pagination = action.payload.pagination;
        state.page = action.payload.page;
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { logAddedFromSocket } = activitySlice.actions;

export const selectLogs = (state) => state.activity.items;
export const selectLogsPagination = (state) => state.activity.pagination;
export const selectLogsStatus = (state) => state.activity.status;

export default activitySlice.reducer;