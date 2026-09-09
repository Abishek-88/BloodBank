import { useMemo, useState } from "react";

import IncomingRequestTable from "../../components/blood-bank/IncomingRequestTable.jsx";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import { useBloodBank } from "../../context/BloodBankContext.jsx";

const BloodBankRequestsPage = () => {
  const { requests, inventory, acceptRequest, rejectRequest } = useBloodBank();
  const [filters, setFilters] = useState({
    urgency: "all",
    bloodGroup: "all",
    componentType: "all"
  });

  const inventoryIndex = useMemo(
    () =>
      inventory.reduce((accumulator, item) => {
        accumulator[`${item.blood_group}-${item.component_type}`] = item;
        return accumulator;
      }, {}),
    [inventory]
  );

  const filteredRequests = useMemo(
    () =>
      requests
        .filter((item) => item.status === "pending")
        .filter((item) => (filters.urgency === "all" ? true : item.urgency_level === filters.urgency))
        .filter((item) => (filters.bloodGroup === "all" ? true : item.blood_group === filters.bloodGroup))
        .filter((item) => (filters.componentType === "all" ? true : item.component_type === filters.componentType)),
    [filters, requests]
  );

  return (
    <DashboardLayout>
      <section className="panel span-3">
        <div className="panel-header">
          <h3>Incoming Requests</h3>
          <span className="pill">Realtime pending only</span>
        </div>
        <div className="filter-bar">
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
          <label>
            Blood Group
            <select value={filters.bloodGroup} onChange={(event) => setFilters((current) => ({ ...current, bloodGroup: event.target.value }))}>
              <option value="all">All</option>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </label>
          <label>
            Component
            <select value={filters.componentType} onChange={(event) => setFilters((current) => ({ ...current, componentType: event.target.value }))}>
              <option value="all">All</option>
              {["whole_blood", "platelets", "plasma", "rbc"].map((component) => (
                <option key={component} value={component}>{component}</option>
              ))}
            </select>
          </label>
        </div>
        <IncomingRequestTable
          requests={filteredRequests}
          inventoryIndex={inventoryIndex}
          onAccept={acceptRequest}
          onReject={rejectRequest}
        />
      </section>
    </DashboardLayout>
  );
};

export default BloodBankRequestsPage;
