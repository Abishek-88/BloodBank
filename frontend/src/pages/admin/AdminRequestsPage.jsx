import { useMemo, useState } from "react";

import StatusBadge from "../../components/common/StatusBadge.jsx";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import { useAdmin } from "../../context/AdminContext.jsx";

const AdminRequestsPage = () => {
  const { requests } = useAdmin();
  const [filters, setFilters] = useState({ status: "all", urgency: "all" });

  const filtered = useMemo(
    () =>
      requests
        .filter((item) => (filters.status === "all" ? true : item.status === filters.status))
        .filter((item) => (filters.urgency === "all" ? true : item.urgency_level === filters.urgency)),
    [filters, requests]
  );

  return (
    <DashboardLayout>
      <section className="panel span-3">
        <div className="panel-header">
          <h3>Requests Monitoring</h3>
          <span className="pill">Status + urgency filters</span>
        </div>
        <div className="filter-bar">
          <label>
            Status
            <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="dispatched">Dispatched</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
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
        <div className="request-table">
          <table className="data-table">
            <thead>
              <tr>
                <th>Hospital</th>
                <th>Blood</th>
                <th>Units</th>
                <th>Urgency</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>{item.hospital_name}</td>
                  <td>{item.blood_group} {item.component_type}</td>
                  <td>{item.units_needed}</td>
                  <td><StatusBadge status={item.urgency_level} /></td>
                  <td><StatusBadge status={item.status} /></td>
                  <td>{new Date(item.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default AdminRequestsPage;
