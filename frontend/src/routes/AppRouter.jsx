import { Navigate, Route, Routes } from "react-router-dom";

import LandingPage from "../pages/shared/LandingPage.jsx";
import LoginPage from "../pages/shared/LoginPage.jsx";
import HospitalDashboardPage from "../pages/hospital/HospitalDashboardPage.jsx";
import HospitalCreateRequestPage from "../pages/hospital/HospitalCreateRequestPage.jsx";
import HospitalActiveRequestsPage from "../pages/hospital/HospitalActiveRequestsPage.jsx";
import HospitalHistoryPage from "../pages/hospital/HospitalHistoryPage.jsx";
import BloodBankDashboardPage from "../pages/blood-bank/BloodBankDashboardPage.jsx";
import BloodBankInventoryPage from "../pages/blood-bank/BloodBankInventoryPage.jsx";
import BloodBankRequestsPage from "../pages/blood-bank/BloodBankRequestsPage.jsx";
import BloodBankDeliveriesPage from "../pages/blood-bank/BloodBankDeliveriesPage.jsx";
import BloodBankHistoryPage from "../pages/blood-bank/BloodBankHistoryPage.jsx";
import CourierDashboardPage from "../pages/courier/CourierDashboardPage.jsx";
import CourierDeliveriesPage from "../pages/courier/CourierDeliveriesPage.jsx";
import CourierHistoryPage from "../pages/courier/CourierHistoryPage.jsx";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage.jsx";
import AdminUsersPage from "../pages/admin/AdminUsersPage.jsx";
import AdminRequestsPage from "../pages/admin/AdminRequestsPage.jsx";
import AdminDeliveriesPage from "../pages/admin/AdminDeliveriesPage.jsx";
import AdminLogsPage from "../pages/admin/AdminLogsPage.jsx";
import AdminAnalyticsPage from "../pages/admin/AdminAnalyticsPage.jsx";

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<Navigate to="/" replace />} />
    <Route path="/hospital/login" element={<LoginPage role="hospital" />} />
    <Route path="/blood-bank/login" element={<LoginPage role="blood_bank" />} />
    <Route path="/courier/login" element={<LoginPage role="courier" />} />
    <Route path="/admin/login" element={<LoginPage role="admin" />} />
    <Route path="/hospital/dashboard" element={<HospitalDashboardPage />} />
    <Route path="/hospital/create-request" element={<HospitalCreateRequestPage />} />
    <Route path="/hospital/active-requests" element={<HospitalActiveRequestsPage />} />
    <Route path="/hospital/history" element={<HospitalHistoryPage />} />
    <Route path="/blood-bank/dashboard" element={<BloodBankDashboardPage />} />
    <Route path="/blood-bank/inventory" element={<BloodBankInventoryPage />} />
    <Route path="/blood-bank/requests" element={<BloodBankRequestsPage />} />
    <Route path="/blood-bank/deliveries" element={<BloodBankDeliveriesPage />} />
    <Route path="/blood-bank/history" element={<BloodBankHistoryPage />} />
    <Route path="/courier/dashboard" element={<CourierDashboardPage />} />
    <Route path="/courier/deliveries" element={<CourierDeliveriesPage />} />
    <Route path="/courier/history" element={<CourierHistoryPage />} />
    <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
    <Route path="/admin/users" element={<AdminUsersPage />} />
    <Route path="/admin/requests" element={<AdminRequestsPage />} />
    <Route path="/admin/deliveries" element={<AdminDeliveriesPage />} />
    <Route path="/admin/logs" element={<AdminLogsPage />} />
    <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRouter;
