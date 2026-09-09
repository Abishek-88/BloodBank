import { Server } from "socket.io";

export const initSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST", "PUT"]
    }
  });

  io.on("connection", (socket) => {
    socket.on("room:join", ({ role, entityId }) => {
      socket.join(`${role}:${entityId}`);
    });

    socket.on("new_request", (payload) => {
      io.emit("new_request", payload);
    });

    socket.on("status_update", (payload) => {
      io.emit("status_update", payload);
    });

    socket.on("location_update", (payload) => {
      io.emit("location_update", payload);
    });

    socket.on("tracking:update", (payload) => {
      io.emit("tracking:live", payload);
    });
  });

  return io;
};
