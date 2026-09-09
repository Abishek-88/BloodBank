import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  deleteAdminUser,
  fetchAdminAssignments,
  fetchAdminLogs,
  fetchAdminRequests,
  fetchAnalytics,
  fetchUsers,
  updateAdminUser
} from "../api/requestApi.js";
import { useAuth } from "./AuthContext.jsx";
import useSocket from "../hooks/useSocket.js";

const AdminContext = createContext({
  users: [],
  requests: [],
  assignments: [],
  logs: [],
  analytics: null,
  notifications: [],
  refreshAll: async () => {},
  toggleUser: async () => {},
  removeUser: async () => {},
  dismissNotification: () => {}
});

export const AdminProvider = ({ children }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [logs, setLogs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = "info") => {
    const id = Date.now() + Math.random();
    setNotifications((current) => [{ id, message, type }, ...current].slice(0, 5));
    window.setTimeout(() => {
      setNotifications((current) => current.filter((item) => item.id !== id));
    }, 4000);
  };

  const dismissNotification = (id) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
  };

  const refreshAll = async () => {
    const results = await Promise.allSettled([
      fetchUsers(),
      fetchAdminRequests(),
      fetchAdminAssignments(),
      fetchAdminLogs(),
      fetchAnalytics()
    ]);

    setUsers(results[0].status === "fulfilled" ? results[0].value.data?.data || [] : []);
    setRequests(results[1].status === "fulfilled" ? results[1].value.data?.data || [] : []);
    setAssignments(results[2].status === "fulfilled" ? results[2].value.data?.data || [] : []);
    setLogs(results[3].status === "fulfilled" ? results[3].value.data?.data || [] : []);
    setAnalytics(results[4].status === "fulfilled" ? results[4].value.data?.data || null : null);
  };

  useEffect(() => {
    if (user?.role !== "admin") {
      setUsers([]);
      setRequests([]);
      setAssignments([]);
      setLogs([]);
      setAnalytics(null);
      return;
    }

    refreshAll();
  }, [user]);

  useSocket({
    new_request: () => {
      if (user?.role === "admin") {
        refreshAll();
        addNotification("New emergency request detected.", "info");
      }
    },
    status_update: () => {
      if (user?.role === "admin") {
        refreshAll();
        addNotification("System status changed.", "info");
      }
    },
    delivery_update: () => {
      if (user?.role === "admin") {
        refreshAll();
        addNotification("Delivery update received.", "success");
      }
    }
  });

  const toggleUser = async (userId, isActive) => {
    await updateAdminUser(userId, { isActive });
    addNotification(`User ${isActive ? "activated" : "deactivated"}.`, "success");
    await refreshAll();
  };

  const removeUser = async (userId) => {
    await deleteAdminUser(userId);
    addNotification("User deleted.", "info");
    await refreshAll();
  };

  const value = useMemo(
    () => ({
      users,
      requests,
      assignments,
      logs,
      analytics,
      notifications,
      refreshAll,
      toggleUser,
      removeUser,
      dismissNotification
    }),
    [analytics, assignments, logs, notifications, requests, users]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => useContext(AdminContext);
