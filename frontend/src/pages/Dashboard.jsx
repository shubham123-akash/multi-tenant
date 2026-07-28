import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PROJECT_API_END_POINT,
  TENANT_API_END_POINT,
  USER_API_END_POINT
} from "../utils/Constant";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsCards from "../components/dashboard/StatsCards";
import UsersView from "../components/dashboard/UsersView";
import ProjectsView from "../components/dashboard/ProjectsView";
import RecentActivity from "../components/dashboard/RecentActivity";

const Dashboard = () => {

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [tenant, setTenant] = useState(null);
  const [role, setRole] = useState("");
  const [view, setView] = useState("");

  const fetchData = async () => {
    const [tenantRes, projectRes, userRes, meRes] = await Promise.all([
      axios.get(`${TENANT_API_END_POINT}/getTenantInfo`, { withCredentials: true }),
      axios.get(`${PROJECT_API_END_POINT}/getAllProjects`, { withCredentials: true }),
      axios.get(`${USER_API_END_POINT}/getUsers`, { withCredentials: true }),
      axios.get(`${USER_API_END_POINT}/me`, { withCredentials: true })
    ]);

    setTenant(tenantRes.data);
    setProjects(projectRes.data);
    setUsers(userRes.data);
    setRole(meRes.data.role);
  };

  useEffect(() => {
    fetchData();
  }, []);

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