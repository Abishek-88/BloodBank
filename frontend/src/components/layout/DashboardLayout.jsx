import Sidebar from "./Sidebar.jsx";
import { useAdmin } from "../../context/AdminContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useBloodBank } from "../../context/BloodBankContext.jsx";
import { useCourier } from "../../context/CourierContext.jsx";
import { useHospital } from "../../context/HospitalContext.jsx";
import ToastStack from "../common/ToastStack.jsx";

const DashboardLayout = ({ children }) => {
  const { user } = useAuth();
  const admin = useAdmin();
  const { notifications, dismissNotification } = useHospital();
  const bloodBank = useBloodBank();
  const courier = useCourier();

  return (
    <div className="app-shell">
      <Sidebar role={user.role} />
      <main className="main-panel">
        <div className="content-grid">{children}</div>
        {user.role === "hospital" ? (
          <ToastStack notifications={notifications} onDismiss={dismissNotification} />
        ) : null}
        {user.role === "blood_bank" ? (
          <ToastStack
            notifications={bloodBank.notifications}
            onDismiss={bloodBank.dismissNotification}
          />
        ) : null}
        {user.role === "courier" ? (
          <ToastStack notifications={courier.notifications} onDismiss={courier.dismissNotification} />
        ) : null}
        {user.role === "admin" ? (
          <ToastStack notifications={admin.notifications} onDismiss={admin.dismissNotification} />
        ) : null}
      </main>
    </div>
  );
};

export default DashboardLayout;
