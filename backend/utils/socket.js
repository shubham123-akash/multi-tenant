import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Project from "../models/project.model.js";

let io = null;

// Minimal cookie-header parser (avoids relying on the `cookie` package's
// export shape, which varies across versions/interop and caused import
// errors here). Handles the standard "name=value; name2=value2" format.
const parseCookies = (cookieHeader = "") => {
  const result = {};

  cookieHeader.split(";").forEach((pair) => {
    const index = pair.indexOf("=");
    if (index === -1) return;

    const key = pair.slice(0, index).trim();
    const value = pair.slice(index + 1).trim();

    if (key) {
      try {
        result[key] = decodeURIComponent(value);
      } catch {
        result[key] = value;
      }
    }
  });

  return result;
};

// Rooms:
//  - `tenant:{tenantId}`   every connected user auto-joins theirs - used for
//                          tenant-wide events (activity feed, project list changes)
//  - `project:{projectId}` joined on demand by clients viewing a specific
//                          project - used for task/member updates on that project
export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true
    }
  });

  // Authenticate the socket using the same access-token cookie used for HTTP requests
  io.use((socket, next) => {
    try {
      const rawCookies = socket.handshake.headers.cookie;

      if (!rawCookies) {
        return next(new Error("Authentication required"));
      }

      const parsedCookies = parseCookies(rawCookies);
      const token = parsedCookies.token;

      if (!token) {
        return next(new Error("Authentication required"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      socket.user = {
        userId: decoded.userId,
        tenantId: decoded.tenantId,
        role: decoded.role
      };

      next();
    } catch (error) {
      console.log("🔌 Socket auth failed:", error.message);
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    const { tenantId, userId } = socket.user;

    console.log(`🔌 Socket connected: user=${userId} tenant=${tenantId} socketId=${socket.id}`);

    // every user automatically gets tenant-wide events
    socket.join(`tenant:${tenantId}`);

    // client asks to receive live updates for a specific project
    // (e.g. while the Project Members / Tasks modal is open)
    socket.on("project:join", async (projectId) => {
      try {
        if (!projectId) return;

        const project = await Project.findOne({
          _id: projectId,
          tenantId
        }).select("_id");

        // only allow joining rooms for projects that belong to this tenant
        if (project) {
          socket.join(`project:${projectId}`);
        }
      } catch (error) {
        // invalid id or lookup failure - just ignore the join request
      }
    });

    socket.on("project:leave", (projectId) => {
      if (projectId) socket.leave(`project:${projectId}`);
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Socket disconnected: user=${userId} socketId=${socket.id}`);
      // rooms are cleaned up automatically by socket.io on disconnect
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized. Call initSocket(server) first.");
  }
  return io;
};

// Small helpers so controllers don't need to import socket internals directly
export const emitToTenant = (tenantId, event, payload) => {
  try {
    getIO().to(`tenant:${tenantId}`).emit(event, payload);
  } catch (error) {
    console.log("Socket emit (tenant) skipped:", error.message);
  }
};

export const emitToProject = (projectId, event, payload) => {
  try {
    getIO().to(`project:${projectId}`).emit(event, payload);
  } catch (error) {
    console.log("Socket emit (project) skipped:", error.message);
  }
};