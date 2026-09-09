import CourierDeliveryTable from "../../components/courier/CourierDeliveryTable.jsx";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import { useCourier } from "../../context/CourierContext.jsx";

const CourierHistoryPage = () => {
  const { deliveries, locationMap } = useCourier();
  const completed = deliveries.filter((item) => item.status === "delivered");

  return (
    <DashboardLayout>
      <section className="panel span-3">
        <div className="panel-header">
          <h3>Completed Deliveries</h3>
          <span className="pill">delivery archive</span>
        </div>
        <CourierDeliveryTable
          deliveries={completed}
          onUpdateStatus={() => {}}
          locationMap={locationMap}
          showActions={false}
        />
      </section>
    </DashboardLayout>
  );
};

export default CourierHistoryPage;
