import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  fetchBankAssignments,
  fetchInventory,
  fetchRequests,
  updateInventory as updateInventoryRequest,
  updateRequest
} from "../api/requestApi.js";
import { useAuth } from "./AuthContext.jsx";
import useSocket from "../hooks/useSocket.js";

const BloodBankContext = createContext({
  inventory: [],
  requests: [],
  deliveries: [],
  notifications: [],
  stats: { totalRequests: 0, acceptedRequests: 0, activeDeliveries: 0, availableUnits: 0 },
  updateInventoryItem: async () => {},
  acceptRequest: async () => {},
  rejectRequest: async () => {},
  markDelivered: async () => {},
  dismissNotification: () => {}
});

const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };

const normalizeInventory = (item) => ({
  id: item.id,
  bank_id: item.bank_id,
  blood_group: item.blood_group,
  component_type: item.component_type,
  units_available: Number(item.units_available),
  reserved_units: Number(item.reserved_units),
  available_units:
    item.available_units !== undefined
      ? Number(item.available_units)
      : Number(item.units_available) - Number(item.reserved_units)
});

const normalizeRequest = (item) => ({
  id: item.id,
  hospital_name: item.hospital_name,
  blood_group: item.blood_group,
  component_type: item.component_type,
  units_needed: Number(item.units_needed),
  urgency_level: String(item.urgency_level).toLowerCase(),
  status: String(item.status).toLowerCase(),
  courier_name: item.courier_name || null,
  courier_contact: item.courier_contact || null,
  assignment_status: item.assignment_status || null,
  created_at: item.created_at
});

const normalizeDelivery = (item) => ({
  id: item.id,
  request_id: item.request_id,
  courier_id: item.courier_id,
  status: String(item.status).toLowerCase(),
  blood_group: item.blood_group,
  component_type: item.component_type,
  units_needed: Number(item.units_needed),
  urgency_level: String(item.urgency_level).toLowerCase(),
  request_status: String(item.request_status).toLowerCase(),
  courier_name: item.courier_name,
  courier_contact: item.courier_contact
});

const sortRequests = (items) =>
  [...items].sort((a, b) => {
    const urgencyDelta = urgencyOrder[a.urgency_level] - urgencyOrder[b.urgency_level];
    if (urgencyDelta !== 0) {
      return urgencyDelta;
    }

    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });

export const BloodBankProvider = ({ children }) => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
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

  const loadAll = async () => {
    try {
      const [inventoryResponse, requestsResponse, deliveriesResponse] = await Promise.all([
        fetchInventory(),
        fetchRequests(),
        fetchBankAssignments()
      ]);

      setInventory((inventoryResponse.data?.data || []).map(normalizeInventory));
      setRequests(sortRequests((requestsResponse.data?.data || []).map(normalizeRequest)));
      setDeliveries((deliveriesResponse.data?.data || []).map(normalizeDelivery));
    } catch (_error) {
      setInventory([]);
      setRequests([]);
      setDeliveries([]);
    }
  };

  useEffect(() => {
    if (user?.role !== "blood_bank") {
      setInventory([]);
      setRequests([]);
      setDeliveries([]);
      return;
    }

    loadAll();
  }, [user]);

  const socket = useSocket({
    new_request: () => {
      loadAll();
      addNotification("New emergency request received.", "info");
    },
    "request:new": () => {
      loadAll();
    },
    status_update: () => {
      loadAll();
      addNotification("Request status updated in real time.", "info");
    },
    "status:updated": () => {
      loadAll();
    },
    assignment_created: () => {
      loadAll();
      addNotification("Courier assignment created.", "success");
    },
    "assignment:created": () => {
      loadAll();
    },
    delivery_update: () => {
      loadAll();
      addNotification("Delivery update received.", "success");
    },
    "inventory:updated": () => {
      loadAll();
    }
  });

  const updateInventoryItem = async (payload) => {
    await updateInventoryRequest(payload);
    socket.emit("inventory:update", payload);
    addNotification(`Inventory updated for ${payload.bloodGroup}.`, "success");
    await loadAll();
  };

  const acceptRequest = async (requestId) => {
    await updateRequest(requestId, { action: "accept" });
    addNotification(`Request #${requestId} accepted.`, "success");
    await loadAll();
  };

  const rejectRequest = async (requestId) => {
    await updateRequest(requestId, { action: "reject" });
    addNotification(`Request #${requestId} rejected.`, "info");
    await loadAll();
  };

  const markDelivered = async (requestId) => {
    await updateRequest(requestId, { action: "deliver" });
    addNotification(`Delivery completed for request #${requestId}.`, "success");
    await loadAll();
  };

  const stats = useMemo(() => {
    const totalRequests = requests.length;
    const acceptedRequests = requests.filter((item) => item.status === "accepted").length;
    const activeDeliveries = deliveries.filter((item) =>
      ["assigned", "picked_up", "in_transit"].includes(item.status)
    ).length;
    const availableUnits = inventory.reduce((sum, item) => sum + item.available_units, 0);
    return { totalRequests, acceptedRequests, activeDeliveries, availableUnits };
  }, [deliveries, inventory, requests]);

  const value = useMemo(
    () => ({
      inventory,
      requests,
      deliveries,
      notifications,
      stats,
      updateInventoryItem,
      acceptRequest,
      rejectRequest,
      markDelivered,
      dismissNotification
    }),
    [deliveries, inventory, notifications, requests, stats]
  );

  return <BloodBankContext.Provider value={value}>{children}</BloodBankContext.Provider>;
};

export const useBloodBank = () => useContext(BloodBankContext);
