const DashboardHeader = ({ tenant, role }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">
        {tenant?.companyName || tenant?.name}
      </h1>
      <p className="text-gray-500">
        Role: <span className="font-semibold">{role}</span>
      </p>
    </div>
  );
};

export default DashboardHeader;