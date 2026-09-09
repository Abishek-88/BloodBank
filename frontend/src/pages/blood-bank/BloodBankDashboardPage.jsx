import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import { useBloodBank } from "../../context/BloodBankContext.jsx";

const BloodBankDashboardPage = () => {
  const { stats, requests } = useBloodBank();
  const pendingRequests = requests.filter((item) => item.status === "pending").slice(0, 5);

  return (
    <DashboardLayout>
      <section className="hero-card span-3">
        <div className="hero-card__content">
          <div>
            <p className="eyebrow">Blood Bank Dashboard</p>
            <h3>Manage inventory, respond to live emergency demand, and keep delivery coordination moving.</h3>
            <p className="hero-card__copy">
              Incoming requests are sorted by urgency, stock is reserved in real time, and all actions are logged.
            </p>
          </div>
        </div>
      </section>
      <StatCard label="Total Requests" value={stats.totalRequests} />
      <StatCard label="Accepted Requests" value={stats.acceptedRequests} accent="amber" />
      <StatCard label="Active Deliveries" value={stats.activeDeliveries} accent="green" />
      <StatCard label="Available Units" value={stats.availableUnits} />
      <section className="panel span-3">
        <div className="panel-header">
          <h3>Pending emergency queue</h3>
          <span className="pill">Critical first</span>
        </div>
        <div className="timeline">
          {pendingRequests.map((request) => (
            <div key={request.id} className="timeline-item">
              <strong>{request.blood_group} {request.component_type}</strong>
              <span>
                {request.hospital_name || `Request #${request.id}`} needs {request.units_needed} units with {request.urgency_level} urgency.
              </span>
            </div>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default BloodBankDashboardPage;
