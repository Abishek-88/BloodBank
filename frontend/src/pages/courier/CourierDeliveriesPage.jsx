import { useMemo, useState } from "react";

import CourierDeliveryTable from "../../components/courier/CourierDeliveryTable.jsx";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import { useCourier } from "../../context/CourierContext.jsx";

const CourierDeliveriesPage = () => {
  const { deliveries, locationMap, updateStatus } = useCourier();
  const [filters, setFilters] = useState({ status: "all", urgency: "all" });

  const filteredDeliveries = useMemo(
    () =>
      deliveries
        .filter((item) => item.status !== "delivered")
        .filter((item) => (filters.status === "all" ? true : item.status === filters.status))
        .filter((item) => (filters.urgency === "all" ? true : item.urgency_level === filters.urgency)),
    [deliveries, filters]
  );

  return (
    <DashboardLayout>
      <section className="panel span-3">
        <div className="panel-header">
          <h3>My Deliveries</h3>
          <span className="pill">assignment_created + status_update</span>
        </div>
        <div className="filter-bar">
          <label>
            Status
            <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
              <option value="all">All</option>
              <option value="assigned">Assigned</option>
              <option value="picked_up">Picked Up</option>
              <option value="in_transit">In Transit</option>
            </select>
          </label>
          <label>
            Urgency
            <select value={filters.urgency} onChange={(event) => setFilters((current) => ({ ...current, urgency: event.target.value }))}>
              <option value="all">All</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
        </div>
        <CourierDeliveryTable
          deliveries={filteredDeliveries}
          onUpdateStatus={updateStatus}
          locationMap={locationMap}
        />
      </section>
    </DashboardLayout>
  );
};

export default CourierDeliveriesPage;
