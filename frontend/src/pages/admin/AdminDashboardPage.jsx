import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import { useAdmin } from "../../context/AdminContext.jsx";

const AdminDashboardPage = () => {
  const { analytics } = useAdmin();
  const overview = analytics?.overview || {};

  return (
    <DashboardLayout>
      <section className="hero-card span-3">
        <div className="hero-card__content">
          <div>
            <p className="eyebrow">Admin Dashboard</p>
            <h3>Monitor users, emergency demand, deliveries, and system activity across MediLink.</h3>
            <p className="hero-card__copy">
              This command view consolidates operational health, audit activity, and response visibility in one place.
            </p>
          </div>
        </div>
      </section>
      <StatCard label="Total Users" value={overview.total_users || 0} />
      <StatCard label="Total Hospitals" value={overview.total_hospitals || 0} accent="amber" />
      <StatCard label="Total Blood Banks" value={overview.total_blood_banks || 0} accent="green" />
      <StatCard label="Total Couriers" value={overview.total_couriers || 0} />
      <StatCard label="Total Requests" value={overview.total_requests || 0} />
      <StatCard label="Active Requests" value={overview.active_requests || 0} accent="amber" />
      <StatCard label="Completed Deliveries" value={overview.completed_deliveries || 0} accent="green" />
    </DashboardLayout>
  );
};

export default AdminDashboardPage;
