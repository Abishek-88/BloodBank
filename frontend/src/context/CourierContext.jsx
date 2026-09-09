import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

import { fetchCourierDeliveries, updateCourierDeliveryStatus } from "../api/requestApi.js";
import { useAuth } from "./AuthContext.jsx";
import useSocket from "../hooks/useSocket.js";

const CourierContext = createContext({
  deliveries: [],
  notifications: [],
  summary: { total_assigned: 0, active_deliveries: 0, completed_deliveries: 0 },
  locationMap: {},
  updateStatus: async () => {},
  dismissNotification: () => {}
});

const statusOrder = ["assigned", "picked_up", "in_transit", "delivered"];

const normalizeDelivery = (item) => ({
  id: item.id,
  request_id: item.request_id,
  courier_id: item.courier_id,
  bank_id: item.bank_id,
  status: String(item.status).toLowerCase(),
  blood_group: item.blood_group,
  component_type: item.component_type,
  units_needed: Number(item.units_needed),
  urgency_level: String(item.urgency_level).toLowerCase(),
  request_status: String(item.request_status).toLowerCase(),
  bank_name: item.bank_name,
  courier_name: item.courier_name,
  courier_contact: item.courier_contact,
  created_at: item.created_at
});

export const CourierProvider = ({ children }) => {
  const { user } = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [summary, setSummary] = useState({
    total_assigned: 0,
    active_deliveries: 0,
    completed_deliveries: 0
  });
  const [notifications, setNotifications] = useState([]);
  const [locationMap, setLocationMap] = useState({});
  const intervalRef = useRef(null);
  const locationRef = useRef({});

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

  useEffect(() => {
    locationRef.current = locationMap;
  }, [locationMap]);

  const socket = useSocket({
    assignment_created: () => {
      loadDeliveries();
      addNotification("New delivery assignment received.", "success");
    },
    "assignment:created": () => {
      loadDeliveries();
    },
    status_update: () => {
      loadDeliveries();
      addNotification("Delivery status updated.", "info");
    },
    "status:updated": () => {
      loadDeliveries();
    },
    delivery_update: () => {
      loadDeliveries();
    },
    location_update: (payload) => {
      if (payload?.assignmentId) {
        setLocationMap((current) => ({
          ...current,
          [payload.assignmentId]: {
            latitude: payload.latitude,
            longitude: payload.longitude
          }
        }));
      }
    }
  });

  const loadDeliveries = async () => {
    try {
      const response = await fetchCourierDeliveries();
      setDeliveries((response.data?.data || []).map(normalizeDelivery));
      setSummary(response.data?.summary || {
        total_assigned: 0,
        active_deliveries: 0,
        completed_deliveries: 0
      });
    } catch (_error) {
      setDeliveries([]);
    }
  };

  useEffect(() => {
    if (user?.role !== "courier") {
      setDeliveries([]);
      setNotifications([]);
      setLocationMap({});
      return;
    }

    loadDeliveries();
  }, [user]);

  useEffect(() => {
    if (user?.role !== "courier") {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setDeliveries((current) => {
        const active = current.find((item) => item.status === "in_transit");
        if (!active) {
          return current;
        }

        const previous = locationRef.current[active.id] || { latitude: 12.9716, longitude: 77.5946 };
        const next = {
          latitude: Number((previous.latitude + 0.0012).toFixed(6)),
          longitude: Number((previous.longitude + 0.0011).toFixed(6))
        };

        socket.emit("location_update", { assignmentId: active.id, ...next });
        setLocationMap((currentMap) => ({ ...currentMap, [active.id]: next }));
        return current;
      });
    }, 2500);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [socket, user]);

  const updateStatus = async (assignmentId, status) => {
    const location = locationMap[assignmentId] || { latitude: 12.9716, longitude: 77.5946 };
    await updateCourierDeliveryStatus(assignmentId, { status, location: `${location.latitude}, ${location.longitude}` });
    addNotification(`Assignment #${assignmentId} moved to ${status}.`, status === "delivered" ? "success" : "info");
    await loadDeliveries();
  };

  const value = useMemo(
    () => ({
      deliveries,
      notifications,
      summary,
      locationMap,
      statusOrder,
      updateStatus,
      dismissNotification
    }),
    [deliveries, notifications, summary, locationMap]
  );

  return <CourierContext.Provider value={value}>{children}</CourierContext.Provider>;
};

export const useCourier = () => useContext(CourierContext);
