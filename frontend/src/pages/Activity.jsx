import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchLogs,
  logAddedFromSocket,
  selectLogs,
  selectLogsPagination,
  selectLogsStatus,
} from "../features/activity/activitySlice";
import { selectRole } from "../features/auth/authSlice";
import Pagination from "../components/common/Pagination";
import { socket } from "../utils/socket";

const Activity = () => {

  const dispatch = useDispatch();
  const logs = useSelector(selectLogs);
  const pagination = useSelector(selectLogsPagination);
  const status = useSelector(selectLogsStatus);
  const role = useSelector(selectRole);

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchLogs(page));
  }, [dispatch, page]);

  // 🔴 Live activity feed - prepend new logs as they happen, but only
  // while viewing the first page (older pages shouldn't shift under you)
  useEffect(() => {
    const handleNewLog = (log) => dispatch(logAddedFromSocket(log));

    socket.on("activity:new", handleNewLog);
    return () => socket.off("activity:new", handleNewLog);
  }, [dispatch]);

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

        {status === "loading" ? (
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