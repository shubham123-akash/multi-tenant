import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { selectTenant } from "../features/tenant/tenantSlice";
import { selectRole } from "../features/auth/authSlice";
import { fetchProjects, selectProjects } from "../features/projects/projectsSlice";
import { fetchUsers, selectUsers } from "../features/users/usersSlice";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsCards from "../components/dashboard/StatsCards";
import UsersView from "../components/dashboard/UsersView";
import ProjectsView from "../components/dashboard/ProjectsView";
import RecentActivity from "../components/dashboard/RecentActivity";

const Dashboard = () => {

  const dispatch = useDispatch();

  // tenant is fetched once in Navbar (mounted alongside every protected
  // page via MainLayout), role comes from the /me fetch App-level effect —
  // Dashboard just reads both instead of re-fetching them
  const tenant = useSelector(selectTenant);
  const role = useSelector(selectRole);
  const projects = useSelector(selectProjects);
  const users = useSelector(selectUsers);

  const [view, setView] = useState("");

  useEffect(() => {
    dispatch(fetchProjects(1));
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="space-y-8">

      <DashboardHeader tenant={tenant} role={role} />

      <StatsCards
        users={users}
        projects={projects}
        role={role}
        setView={setView}
      />

      {view === "users" && <UsersView users={users} />}
      {view === "projects" && <ProjectsView projects={projects} />}

      <RecentActivity projects={projects} />

    </div>
  );
};

export default Dashboard;