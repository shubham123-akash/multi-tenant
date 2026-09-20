import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { USER_API_END_POINT } from "../../utils/Constant";

// GET /me — returns the raw user doc (see backend getMe controller)
export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`${USER_API_END_POINT}/me`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch user");
    }
  }
);

// POST /login — only sets cookies + { success, message }, no user payload,
// so we chain a fetchMe right after so the store ends up with the user too.
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`${USER_API_END_POINT}/login`, credentials, {
        headers: { "Content-Type": "application/json" },
      });
      await dispatch(fetchMe());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`${USER_API_END_POINT}/logout`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Logout failed");
    }
  }
);

const initialState = {
  user: null,       // raw user doc from /me: { _id, name, email, role, tenantId, ... }
  status: "idle",    // idle | loading | succeeded | failed
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // handy for the axiosInstance 401 interceptor to clear stale state
    // client-side without waiting on a network round trip
    clearAuth: (state) => {
      state.user = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMe
      .addCase(fetchMe.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.error = action.payload;
      })
      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // logoutUser
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
      });
  },
});

export const { clearAuth } = authSlice.actions;

// selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectRole = (state) => state.auth.user?.role || "";
export const selectAuthStatus = (state) => state.auth.status;

export default authSlice.reducer;