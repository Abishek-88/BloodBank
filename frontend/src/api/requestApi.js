import axiosClient from "./axiosClient";

export const fetchRequests = (params) => axiosClient.get("/requests", { params });
export const createRequest = (payload) => axiosClient.post("/requests", payload);
export const updateRequest = (requestId, payload) => axiosClient.put(`/requests/${requestId}`, payload);
export const fetchInventory = (bankId) => bankId ? axiosClient.get(`/inventory/${bankId}`) : axiosClient.get("/inventory");
export const updateInventory = (payload) => axiosClient.put("/inventory/update", payload);
export const fetchAssignments = (courierId) => axiosClient.get(`/assignments/courier/${courierId}`);
export const fetchBankAssignments = (params) => axiosClient.get("/assign", { params });
export const assignCourier = (payload) => axiosClient.post("/assign", payload);
export const updateAssignmentStatus = (payload) => axiosClient.put("/status", payload);
export const fetchCourierDeliveries = () => axiosClient.get("/courier/deliveries");
export const updateCourierDeliveryStatus = (assignmentId, payload) =>
  axiosClient.put(`/courier/status/${assignmentId}`, payload);
export const fetchLogs = (requestId) => axiosClient.get(`/status/logs/${requestId}`);
export const fetchUsers = (params) => axiosClient.get("/admin/users", { params });
export const updateAdminUser = (userId, payload) => axiosClient.put(`/admin/user/${userId}`, payload);
export const deleteAdminUser = (userId) => axiosClient.delete(`/admin/user/${userId}`);
export const updateVerification = (type, id, payload) => axiosClient.put(`/admin/verification/${type}/${id}`, payload);
export const fetchAdminRequests = (params) => axiosClient.get("/admin/requests", { params });
export const fetchAdminAssignments = () => axiosClient.get("/admin/assignments");
export const fetchAdminLogs = (params) => axiosClient.get("/admin/logs", { params });
export const fetchAnalytics = () => axiosClient.get("/admin/analytics");
