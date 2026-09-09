import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import InventoryTable from "../../components/blood-bank/InventoryTable.jsx";
import { useBloodBank } from "../../context/BloodBankContext.jsx";

const BloodBankInventoryPage = () => {
  const { inventory, updateInventoryItem } = useBloodBank();

  return (
    <DashboardLayout>
      <section className="panel span-3">
        <div className="panel-header">
          <h3>Inventory</h3>
          <span className="pill">Reserved units protected</span>
        </div>
        <InventoryTable inventory={inventory} onUpdate={updateInventoryItem} />
      </section>
    </DashboardLayout>
  );
};

export default BloodBankInventoryPage;
