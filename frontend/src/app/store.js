import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import tenantReducer from "../features/tenant/tenantSlice";
import projectsReducer from "../features/projects/projectsSlice";
import usersReducer from "../features/users/usersSlice";
import activityReducer from "../features/activity/activitySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tenant: tenantReducer,
    projects: projectsReducer,
    users: usersReducer,
    activity: activityReducer,
  },
});

export default store;