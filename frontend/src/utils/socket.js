import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:8000";

// autoConnect is false - we connect explicitly once we know the user is
// authenticated (see MainLayout in components/Body.js), so logged-out
// visitors on /login or /register never attempt a socket handshake.
export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false
});

export const connectSocket = () => {
  if (!socket.connected) socket.connect();
};

export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};

// Join the room for a specific project's live task/member updates.
// Call this when a project detail view mounts, and joinProject's
// counterpart (leaveProject) when it unmounts.
export const joinProjectRoom = (projectId) => {
  if (projectId) socket.emit("project:join", projectId);
};

export const leaveProjectRoom = (projectId) => {
  if (projectId) socket.emit("project:leave", projectId);
};