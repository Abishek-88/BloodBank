import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import RequestTable from "../../components/hospital/RequestTable.jsx";
import { useHospital } from "../../context/HospitalContext.jsx";

const HospitalDashboardPage = () => {
  const { requests, stats } = useHospital();
  const activeRequests = requests.filter((item) => item.status !== "delivered").slice(0, 4);

  return (
    <DashboardLayout>
      <section className="hero-card span-3">
        <div className="hero-card__content">
          <div>
            <p className="eyebrow">Hospital Dashboard</p>
            <h3>Monitor emergency demand, courier assignment, and request progression in one view.</h3>
            <p className="hero-card__copy">
              Requests are prioritized automatically, tracked live, and surfaced to the hospital team without refresh.
            </p>
          </div>
        </div>
      </section>
      <StatCard label="Total Requests" value={stats.total} />
      <StatCard label="Active Requests" value={stats.active} accent="amber" />
      <StatCard label="Delivered Requests" value={stats.delivered} accent="green" />
      <StatCard label="Critical Requests" value={stats.critical} />
      <section className="panel span-3">
        <div className="panel-header">
          <h3>Active request overview</h3>
          <span className="pill">Live status tracking</span>
        </div>
        <RequestTable requests={activeRequests} />
      </section>
    </DashboardLayout>
  );
};

export default HospitalDashboardPage;
