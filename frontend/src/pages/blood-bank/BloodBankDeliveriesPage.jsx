import DeliveriesTable from "../../components/blood-bank/DeliveriesTable.jsx";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import { useBloodBank } from "../../context/BloodBankContext.jsx";

const BloodBankDeliveriesPage = () => {
  const { deliveries, markDelivered } = useBloodBank();
  const activeDeliveries = deliveries.filter((item) =>
    ["assigned", "picked_up", "in_transit", "delivered"].includes(item.status)
  );

  return (
    <DashboardLayout>
      <section className="panel span-3">
        <div className="panel-header">
          <h3>Active Deliveries</h3>
          <span className="pill">Assignments + emergency requests</span>
        </div>
        <DeliveriesTable deliveries={activeDeliveries} onDeliver={markDelivered} />
      </section>
    </DashboardLayout>
  );
};

export default BloodBankDeliveriesPage;
