import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import StatCard from "../../components/common/StatCard.jsx";
import { useCourier } from "../../context/CourierContext.jsx";

const CourierDashboardPage = () => {
  const { deliveries, summary } = useCourier();
  const active = deliveries.filter((item) => item.status !== "delivered").slice(0, 4);

  return (
    <DashboardLayout>
      <section className="hero-card span-3">
        <div className="hero-card__content">
          <div>
            <p className="eyebrow">Courier Dashboard</p>
            <h3>Track assigned deliveries, advance status in real time, and simulate live route progress.</h3>
            <p className="hero-card__copy">
              Every delivery update propagates instantly across MediLink and every courier action is logged.
            </p>
          </div>
        </div>
      </section>
      <StatCard label="Total Assigned" value={summary.total_assigned} />
      <StatCard label="Active Deliveries" value={summary.active_deliveries} accent="amber" />
      <StatCard label="Completed Deliveries" value={summary.completed_deliveries} accent="green" />
      <section className="panel span-3">
        <div className="panel-header">
          <h3>Active queue</h3>
          <span className="pill">Realtime courier view</span>
        </div>
        <div className="timeline">
          {active.map((delivery) => (
            <div key={delivery.id} className="timeline-item">
              <strong>Request #{delivery.request_id}</strong>
              <span>
                {delivery.blood_group} {delivery.component_type}, {delivery.units_needed} units, status {delivery.status}.
              </span>
            </div>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default CourierDashboardPage;
