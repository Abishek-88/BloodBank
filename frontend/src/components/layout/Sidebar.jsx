import { NavLink } from "react-router-dom";

import { useAuth } from "../../context/AuthContext.jsx";

const navConfig = {
  hospital: [
    { to: "/hospital/dashboard", label: "Dashboard" },
    { to: "/hospital/create-request", label: "Create Request" },
    { to: "/hospital/active-requests", label: "Active Requests" },
    { to: "/hospital/history", label: "Request History" }
  ],
  blood_bank: [
    { to: "/blood-bank/dashboard", label: "Dashboard" },
    { to: "/blood-bank/inventory", label: "Inventory" },
    { to: "/blood-bank/requests", label: "Incoming Requests" },
    { to: "/blood-bank/deliveries", label: "Active Deliveries" },
    { to: "/blood-bank/history", label: "History" }
  ],
  courier: [
    { to: "/courier/dashboard", label: "Dashboard" },
    { to: "/courier/deliveries", label: "My Deliveries" },
    { to: "/courier/history", label: "Completed Deliveries" }
  ],
  admin: [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/users", label: "User Management" },
    { to: "/admin/requests", label: "Requests Monitoring" },
    { to: "/admin/deliveries", label: "Deliveries Tracking" },
    { to: "/admin/logs", label: "Logs & Activity" },
    { to: "/admin/analytics", label: "Analytics" }
  ]
};

const roleTitles = {
  hospital: "Hospital",
  blood_bank: "Blood Bank",
  courier: "Courier",
  admin: "Admin"
};

const Sidebar = ({ role }) => {
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="brand-mark brand-mark--minimal">
          <span className="brand-mark__pulse" />
          <h1>{roleTitles[role] || "MediLink"}</h1>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navConfig[role]?.map((item) => (
          <NavLink key={item.to} to={item.to} className="nav-link">
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-actions">
        <button type="button" className="ghost-button sidebar-signout" onClick={logout}>
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
