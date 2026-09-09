import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { createRequest, fetchRequests } from "../api/requestApi.js";
import { useAuth } from "./AuthContext.jsx";
import useSocket from "../hooks/useSocket.js";

const HospitalContext = createContext(null);

const urgencyOrder = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3
};

const normalizeRequest = (request) => ({
  id: request.id || Date.now(),
  blood_group: request.blood_group || request.bloodGroup,
  units_needed: request.units_needed || request.unitsNeeded,
  urgency_level: String(request.urgency_level || request.urgencyLevel || "medium").toLowerCase(),
  status: String(request.status || "pending").toLowerCase(),
  created_at: request.created_at || new Date().toISOString(),
  delivered_at: request.delivered_at || null,
  component_type: request.component_type || request.componentType || "whole_blood",
  assignedCourier:
    request.assignedCourier ||
    (request.courier_name
      ? {
          name: request.courier_name,
          contact: request.courier_contact || "Dispatch line unavailable",
          deliveryStatus: request.assignment_status || request.status || "assigned"
        }
      : null)
});

const buildNotificationMessage = (request) => {
  if (request.status === "accepted") {
    return `Blood bank accepted request #${request.id}.`;
  }

  if (request.status === "dispatched") {
    return `Courier dispatched for request #${request.id}.`;
  }

  if (request.status === "delivered") {
    return `Delivery completed for request #${request.id}.`;
  }

  return `New emergency request #${request.id} has been logged.`;
};

export const HospitalProvider = ({ children }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = "info") => {
    const id = Date.now() + Math.random();
    setNotifications((current) => [{ id, message, type }, ...current].slice(0, 4));
    window.setTimeout(() => {
      setNotifications((current) => current.filter((item) => item.id !== id));
    }, 4000);
  };

  const upsertRequest = (incoming, { notify = true } = {}) => {
    const normalized = normalizeRequest(incoming);
    setRequests((current) => {
      const exists = current.some((item) => item.id === normalized.id);
      const next = exists
        ? current.map((item) => (item.id === normalized.id ? { ...item, ...normalized } : item))
        : [normalized, ...current];

      return [...next].sort((a, b) => {
        const urgencyDelta = urgencyOrder[a.urgency_level] - urgencyOrder[b.urgency_level];
        if (urgencyDelta !== 0) {
          return urgencyDelta;
        }

        return new Date(b.created_at) - new Date(a.created_at);
      });
    });

    if (notify) {
      addNotification(buildNotificationMessage(normalized), normalized.status === "delivered" ? "success" : "info");
    }

    return normalized;
  };

  const socket = useSocket({
    "status:updated": (payload) => {
      if (payload?.request) {
        upsertRequest(
          {
            ...payload.request,
            assignedCourier: payload.assignment?.courier_name
              ? {
                  name: payload.assignment.courier_name,
                  contact: payload.assignment.courier_contact || "Dispatch line unavailable",
                  deliveryStatus: payload.assignment.status || payload.request.status
                }
              : undefined
          },
          { notify: true }
        );
      }
    },
    status_update: (payload) => {
      if (payload?.request) {
        upsertRequest(payload.request, { notify: true });
      }
    },
    "request:new": ({ request }) => {
      if (request) {
        upsertRequest(request, { notify: false });
      }
    },
    new_request: (request) => {
      if (request) {
        upsertRequest(request, { notify: false });
      }
    }
  });

  useEffect(() => {
    const loadRequests = async () => {
      if (user?.role !== "hospital") {
        setRequests([]);
        return;
      }

      try {
        const response = await fetchRequests();
        const nextRequests = (response.data?.data || []).map(normalizeRequest).sort((a, b) => {
          const urgencyDelta = urgencyOrder[a.urgency_level] - urgencyOrder[b.urgency_level];
          if (urgencyDelta !== 0) {
            return urgencyDelta;
          }

          return new Date(b.created_at) - new Date(a.created_at);
        });

        setRequests(nextRequests);
      } catch (_error) {
        setRequests([]);
      }
    };

    loadRequests();
  }, [user]);

  const createEmergencyRequest = async ({ bloodGroup, unitsNeeded, urgencyLevel }) => {
    const payload = {
      bloodGroup,
      componentType: "whole_blood",
      unitsNeeded: Number(unitsNeeded),
      urgencyLevel: urgencyLevel.toLowerCase(),
      latitude: 12.9716,
      longitude: 77.5946,
      notes: "Hospital emergency request"
    };

    const response = await createRequest(payload);
    const createdRequest = normalizeRequest(response.data.request);

    const next = upsertRequest(createdRequest, { notify: true });
    socket.emit("new_request", next);
    socket.emit("request:new", { request: next });
    return next;
  };

  const dismissNotification = (id) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
  };

  const stats = useMemo(() => {
    const total = requests.length;
    const active = requests.filter((item) => item.status !== "delivered").length;
    const delivered = requests.filter((item) => item.status === "delivered").length;
    const critical = requests.filter((item) => item.urgency_level === "critical").length;
    return { total, active, delivered, critical };
  }, [requests]);

  const value = useMemo(
    () => ({
      requests,
      notifications,
      stats,
      createEmergencyRequest,
      dismissNotification,
      addNotification
    }),
    [notifications, requests, stats]
  );

  return <HospitalContext.Provider value={value}>{children}</HospitalContext.Provider>;
};

export const useHospital = () => useContext(HospitalContext);
