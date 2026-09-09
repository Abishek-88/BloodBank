import { useMemo, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import RequestTable from "../../components/hospital/RequestTable.jsx";
import { useHospital } from "../../context/HospitalContext.jsx";

const HospitalHistoryPage = () => {
  const { requests } = useHospital();
  const [statusFilter, setStatusFilter] = useState("delivered");
  const [dateRange, setDateRange] = useState("all");

  const historyRequests = useMemo(() => {
    const now = new Date();

    return requests
      .filter((item) => (statusFilter === "all" ? item.status === "delivered" : item.status === statusFilter))
      .filter((item) => {
        if (dateRange === "all") {
          return true;
        }

        const createdAt = new Date(item.created_at);
        const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);

        if (dateRange === "7") {
          return diffDays <= 7;
        }

        if (dateRange === "30") {
          return diffDays <= 30;
        }

        return true;
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [dateRange, requests, statusFilter]);

  return (
    <DashboardLayout>
      <section className="panel span-3">
        <div className="panel-header">
          <h3>Request History</h3>
          <span className="pill">Completed request archive</span>
        </div>
        <div className="filter-bar">
          <label>
            Date Range
            <select value={dateRange} onChange={(event) => setDateRange(event.target.value)}>
              <option value="all">All time</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
            </select>
          </label>
          <label>
            Status
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="delivered">Delivered</option>
              <option value="all">All completed</option>
            </select>
          </label>
        </div>
        <RequestTable requests={historyRequests} showDeliveredAt />
      </section>
    </DashboardLayout>
  );
};

export default HospitalHistoryPage;
