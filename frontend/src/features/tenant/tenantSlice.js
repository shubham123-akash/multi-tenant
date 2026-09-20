import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import { TENANT_API_END_POINT } from "../../utils/Constant";

export const fetchTenantInfo = createAsyncThunk(
  "tenant/fetchInfo",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`${TENANT_API_END_POINT}/getTenantInfo`);
      return res.data; // raw tenant doc, e.g. { _id, name, isActive, ... }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load tenant info");
    }
  }
);

const tenantSlice = createSlice({
  name: "tenant",
  initialState: {
    info: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTenantInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTenantInfo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.info = action.payload;
      })
      .addCase(fetchTenantInfo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const selectTenant = (state) => state.tenant.info;
export const selectTenantStatus = (state) => state.tenant.status;

export default tenantSlice.reducer;