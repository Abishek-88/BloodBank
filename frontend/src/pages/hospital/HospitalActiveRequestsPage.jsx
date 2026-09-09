import { useMemo, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import RequestTable from "../../components/hospital/RequestTable.jsx";
import { useHospital } from "../../context/HospitalContext.jsx";

const PAGE_SIZE = 3;

const urgencyRank = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3
};

const HospitalActiveRequestsPage = () => {
  const { requests } = useHospital();
  const [statusFilter, setStatusFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [page, setPage] = useState(1);

  const activeRequests = useMemo(() => {
    const filtered = requests
      .filter((item) => item.status !== "delivered")
      .filter((item) => (statusFilter === "all" ? true : item.status === statusFilter))
      .filter((item) => (urgencyFilter === "all" ? true : item.urgency_level === urgencyFilter))
      .sort((a, b) => urgencyRank[a.urgency_level] - urgencyRank[b.urgency_level]);

    return filtered;
  }, [requests, statusFilter, urgencyFilter]);

  const totalPages = Math.max(1, Math.ceil(activeRequests.length / PAGE_SIZE));
  const paginated = activeRequests.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <DashboardLayout>
      <section className="panel span-3">
        <div className="panel-header">
          <h3>Active Requests</h3>
          <span className="pill">Critical first sorting</span>
        </div>
        <div className="filter-bar">
          <label>
            Status
            <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1); }}>
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="dispatched">Dispatched</option>
            </select>
          </label>
          <label>
            Urgency
            <select value={urgencyFilter} onChange={(event) => { setUrgencyFilter(event.target.value); setPage(1); }}>
              <option value="all">All</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
        </div>
        <RequestTable requests={paginated} />
        <div className="pagination-bar">
          <button type="button" className="ghost-button" onClick={() => setPage((current) => Math.max(1, current - 1))}>
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button type="button" className="ghost-button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>
            Next
          </button>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default HospitalActiveRequestsPage;
