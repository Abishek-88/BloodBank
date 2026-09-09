import { useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import StatusBadge from "../../components/common/StatusBadge.jsx";
import { useHospital } from "../../context/HospitalContext.jsx";

const HospitalCreateRequestPage = () => {
  const { createEmergencyRequest, addNotification } = useHospital();
  const [form, setForm] = useState({
    bloodGroup: "O-",
    unitsNeeded: 1,
    urgencyLevel: "CRITICAL"
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await createEmergencyRequest(form);
      addNotification(`Emergency request for ${form.bloodGroup} created successfully.`, "success");
    } catch (_error) {
      addNotification("Unable to create request. Please verify the backend and database records.", "info");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <section className="panel span-3">
        <div className="panel-header">
          <h3>Create Emergency Request</h3>
          <StatusBadge status={form.urgencyLevel} />
        </div>
        <form className="request-form" onSubmit={handleSubmit}>
          <label>
            Blood Group
            <select
              value={form.bloodGroup}
              onChange={(event) => setForm((current) => ({ ...current, bloodGroup: event.target.value }))}
            >
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </label>
          <label>
            Units Needed
            <input
              type="number"
              min="1"
              value={form.unitsNeeded}
              onChange={(event) => setForm((current) => ({ ...current, unitsNeeded: event.target.value }))}
            />
          </label>
          <label>
            Urgency Level
            <select
              value={form.urgencyLevel}
              onChange={(event) => setForm((current) => ({ ...current, urgencyLevel: event.target.value }))}
            >
              {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="landing-enter" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Emergency Request"}
          </button>
        </form>
      </section>
    </DashboardLayout>
  );
};

export default HospitalCreateRequestPage;
