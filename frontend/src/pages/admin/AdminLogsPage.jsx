import { useMemo, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import { useAdmin } from "../../context/AdminContext.jsx";

const AdminLogsPage = () => {
  const { logs } = useAdmin();
  const [filters, setFilters] = useState({ requestId: "", userId: "" });

  const filtered = useMemo(
    () =>
      logs.filter((item) => {
        const requestMatch = filters.requestId ? String(item.request_id || "") === filters.requestId : true;
        const userMatch = filters.userId ? String(item.actor_user_id || "") === filters.userId : true;
        return requestMatch && userMatch;
      }),
    [filters, logs]
  );

  return (
    <DashboardLayout>
      <section className="panel span-3">
        <div className="panel-header">
          <h3>Logs & Activity</h3>
          <span className="pill">Full audit trail</span>
        </div>
        <div className="filter-bar">
          <label>
            Request ID
            <input value={filters.requestId} onChange={(event) => setFilters((current) => ({ ...current, requestId: event.target.value }))} />
          </label>
          <label>
            User ID
            <input value={filters.userId} onChange={(event) => setFilters((current) => ({ ...current, userId: event.target.value }))} />
          </label>
        </div>
        <div className="request-table">
          <table className="data-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Status</th>
                <th>Actor</th>
                <th>Request</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>{item.action_type}</td>
                  <td>{item.status}</td>
                  <td>{item.actor_name || item.actor_user_id || "-"}</td>
                  <td>{item.request_id || "-"}</td>
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

export default AdminLogsPage;
