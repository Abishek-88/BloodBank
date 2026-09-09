import { useNavigate } from "react-router-dom";

const roles = [
  {
    key: "hospital",
    loginPath: "/hospital/login",
    icon: "H",
    title: "Hospital",
    description: "Request supplies or report critical shortages."
  },
  {
    key: "blood_bank",
    loginPath: "/blood-bank/login",
    icon: "B",
    title: "Blood Bank",
    description: "Manage inventory and fulfill urgent requests."
  },
  {
    key: "courier",
    loginPath: "/courier/login",
    icon: "C",
    title: "Courier",
    description: "View active routes and update delivery status."
  },
  {
    key: "admin",
    loginPath: "/admin/login",
    icon: "A",
    title: "Admin",
    description: "Monitor system health and manage participants."
  }
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-shell">
      <main className="landing-main">
        <section className="landing-hero">
          <div className="landing-hero__copy">
            <h2>MediLink</h2>
            <p className="landing-hero__tagline">Connecting Care in Real-Time.</p>
          </div>

          <div className="role-grid">
            {roles.map((item) => (
              <button
                key={item.key}
                type="button"
                className="role-card"
                onClick={() => navigate(item.loginPath)}
              >
                <span className="role-card__icon">{item.icon}</span>
                <div className="role-card__content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
