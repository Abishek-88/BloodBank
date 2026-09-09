import { useMemo, useState } from "react";

import DeliveriesTable from "../../components/blood-bank/DeliveriesTable.jsx";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import { useBloodBank } from "../../context/BloodBankContext.jsx";

const BloodBankHistoryPage = () => {
  const { deliveries } = useBloodBank();
  const [statusFilter, setStatusFilter] = useState("all");

  const history = useMemo(
    () =>
      deliveries.filter((item) =>
        statusFilter === "all" ? true : item.status === statusFilter
      ),
    [deliveries, statusFilter]
  );

  return (
    <DashboardLayout>
      <section className="panel span-3">
        <div className="panel-header">
          <h3>History</h3>
          <span className="pill">Audit-ready delivery archive</span>
        </div>
        <div className="filter-bar">
          <label>
            Status
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">All</option>
              <option value="assigned">Assigned</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
            </select>
          </label>
        </div>
        <DeliveriesTable deliveries={history} onDeliver={() => {}} allowComplete={false} />
      </section>
    </DashboardLayout>
  );
};

export default BloodBankHistoryPage;
