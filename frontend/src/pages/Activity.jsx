// import React, { useEffect, useState } from "react";
// import axiosInstance from "../utils/axiosInstance";
// import toast from "react-hot-toast";
// import { ACTIVITY_API_END_POINT, USER_API_END_POINT } from "../utils/Constant";

// const Activity = () => {

//   const [logs, setLogs] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [role, setRole] = useState("");

//   // 🔥 Fetch logged-in user role
//   const fetchUser = async () => {
//     try {
//       const res = await axiosInstance.get(
//         `${USER_API_END_POINT}/me`,
//         { withCredentials: true }
//       );
//       setRole(res.data.role);
//     } catch (error) {
//       toast.error("Failed to fetch user");
//     }
//   };

//   // 🔥 Fetch activity logs
//   const fetchLogs = async () => {
//     try {
//       setLoading(true);

//       const res = await axiosInstance.get(
//         `${ACTIVITY_API_END_POINT}/getLogs`,
//         { withCredentials: true }
//       );

//       setLogs(res.data);

//     } catch (error) {
//       toast.error("Failed to fetch activity logs");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUser();
//     fetchLogs();
//   }, []);

//   // 🔹 Format Action Text
//   const formatAction = (action) => {
//     return action.replaceAll("_", " ");
//   };

//   // 🔹 Badge Styling
//   const getEntityStyle = (type) => {
//     return type === "PROJECT"
//       ? "bg-blue-100 text-blue-600"
//       : "bg-purple-100 text-purple-600";
//   };

//   // 🔒 Block MEMBER
//   if (role === "MEMBER") {
//     return (
//       <div className="p-6 text-gray-500">
//         You do not have permission to view activity logs.
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">

//       <div>
//         <h1 className="text-3xl font-bold text-gray-800">
//           Activity Logs
//         </h1>
//         <p className="text-gray-500 mt-1">
//           Track all important actions inside your tenant
//         </p>
//       </div>

//       <div className="bg-white rounded-xl shadow-md p-6">

//         {loading ? (
//           <p className="text-gray-400">Loading logs...</p>
//         ) : logs.length === 0 ? (
//           <p className="text-gray-400">No activity found</p>
//         ) : (
//           <ul className="space-y-4">

//             {logs.map((log) => (
//               <li
//                 key={log._id}
//                 className="border-b pb-3 flex justify-between items-start"
//               >
//                 <div>

//                   <p className="font-medium text-gray-800">
//                     {formatAction(log.action)}
//                   </p>

//                   <p className="text-sm text-gray-500">
//                     By {log.performedBy?.name} ({log.performedBy?.role})
//                   </p>

//                   <span
//                     className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold ${getEntityStyle(log.entityType)}`}
//                   >
//                     {log.entityType}
//                   </span>

//                 </div>

//                 <span className="text-xs text-gray-400">
//                   {new Date(log.createdAt).toLocaleString()}
//                 </span>

//               </li>
//             ))}

//           </ul>
//         )}

//       </div>

//     </div>
//   );
// };

// export default Activity;




import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { ACTIVITY_API_END_POINT, USER_API_END_POINT } from "../utils/Constant";
import Pagination from "../components/common/Pagination";

const Activity = () => {

  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");

  // 🔥 Fetch logged-in user role
  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get(
        `${USER_API_END_POINT}/me`,
        { withCredentials: true }
      );
      setRole(res.data.role);
    } catch (error) {
      toast.error("Failed to fetch user");
    }
  };

  // 🔥 Fetch activity logs (paginated)
  const fetchLogs = async (targetPage = 1) => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `${ACTIVITY_API_END_POINT}/getLogs`,
        {
          params: { page: targetPage, limit: 20 },
          withCredentials: true
        }
      );

      setLogs(res.data.logs);
      setPagination(res.data.pagination);

    } catch (error) {
      toast.error("Failed to fetch activity logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  // 🔴 Live activity feed - prepend new logs as they happen, but only
  // while viewing the first page (older pages shouldn't shift under you)
  useEffect(() => {
    const handleNewLog = (log) => {
      if (page === 1) {
        setLogs(prev => [log, ...prev].slice(0, 20));
      }
      setPagination(prev => prev ? { ...prev, totalItems: prev.totalItems + 1 } : prev);
    };

    // socket.on("activity:new", handleNewLog);

    // return () => socket.off("activity:new", handleNewLog);
  }, [page]);

  // 🔹 Format Action Text
  const formatAction = (action) => {
    return action.replaceAll("_", " ");
  };

  // 🔹 Badge Styling
  const getEntityStyle = (type) => {
    return type === "PROJECT"
      ? "bg-blue-100 text-blue-600"
      : "bg-purple-100 text-purple-600";
  };

  // 🔒 Block MEMBER
  if (role === "MEMBER") {
    return (
      <div className="p-6 text-gray-500">
        You do not have permission to view activity logs.
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Activity Logs
        </h1>
        <p className="text-gray-500 mt-1">
          Track all important actions inside your tenant
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">

        {loading ? (
          <p className="text-gray-400">Loading logs...</p>
        ) : logs.length === 0 ? (
          <p className="text-gray-400">No activity found</p>
        ) : (
          <ul className="space-y-4">

            {logs.map((log) => (
              <li
                key={log._id}
                className="border-b pb-3 flex justify-between items-start"
              >
                <div>

                  <p className="font-medium text-gray-800">
                    {formatAction(log.action)}
                  </p>

                  <p className="text-sm text-gray-500">
                    By {log.performedBy?.name} ({log.performedBy?.role})
                  </p>

                  <span
                    className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-semibold ${getEntityStyle(log.entityType)}`}
                  >
                    {log.entityType}
                  </span>

                </div>

                <span className="text-xs text-gray-400">
                  {new Date(log.createdAt).toLocaleString()}
                </span>

              </li>
            ))}

          </ul>
        )}

      </div>

      <Pagination pagination={pagination} onPageChange={setPage} />

    </div>
  );
};

export default Activity;