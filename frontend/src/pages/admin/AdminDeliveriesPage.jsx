import StatusBadge from "../../components/common/StatusBadge.jsx";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import { useAdmin } from "../../context/AdminContext.jsx";

const AdminDeliveriesPage = () => {
  const { assignments } = useAdmin();

  return (
    <DashboardLayout>
      <section className="panel span-3">
        <div className="panel-header">
          <h3>Deliveries Tracking</h3>
          <span className="pill">Assignments + requests</span>
        </div>
        <div className="request-table">
          <table className="data-table">
            <thead>
              <tr>
                <th>Request</th>
                <th>Courier</th>
                <th>Blood Bank</th>
                <th>Status</th>
                <th>Urgency</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((item) => (
                <tr key={item.id}>
                  <td>#{item.request_id}</td>
                  <td>{item.courier_name}</td>
                  <td>{item.bank_name}</td>
                  <td><StatusBadge status={item.status} /></td>
                  <td><StatusBadge status={item.urgency_level} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default AdminDeliveriesPage;
