import AdminModel from "../models/AdminModel.js";

export const getDashboardAnalytics = async () => {
  const [summary, overview, responseTime, recentActivity, urgencyBreakdown, deliveryRate] = await Promise.all([
    AdminModel.getSystemSummary(),
    AdminModel.getDashboardOverview(),
    AdminModel.getAverageResponseTime(),
    AdminModel.getRecentActivity(),
    AdminModel.getRequestsByUrgency(),
    AdminModel.getDeliverySuccessRate()
  ]);

  return { summary, overview, responseTime, recentActivity, urgencyBreakdown, deliveryRate };
};
