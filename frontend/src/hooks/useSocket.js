import { useEffect, useMemo } from "react";
import { io } from "socket.io-client";

import { useAuth } from "../context/AuthContext.jsx";

const useSocket = (handlers = {}) => {
  const { user } = useAuth();
  const socket = useMemo(() => io("http://localhost:5000", { autoConnect: true }), []);

  useEffect(() => {
    if (user) {
      socket.emit("room:join", { role: user.role, entityId: user.id });
    }

    Object.entries(handlers).forEach(([event, handler]) => socket.on(event, handler));

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => socket.off(event, handler));
    };
  }, [handlers, socket, user]);

  return socket;
};

export default useSocket;