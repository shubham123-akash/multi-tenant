import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { USER_API_END_POINT } from "../../utils/Constant";

export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`${USER_API_END_POINT}/getUsers`);
      return res.data; // backend returns a plain array here
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch users");
    }
  }
);

export const createUser = createAsyncThunk(
  "users/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`${USER_API_END_POINT}/createUsers`, formData);
      return res.data; // { message, user }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create user");
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.items.push(action.payload.user);
      });
  },
});

export const selectUsers = (state) => state.users.items;
export const selectUsersStatus = (state) => state.users.status;

export default usersSlice.reducer;