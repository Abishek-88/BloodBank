import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { login as loginRequest } from "../../api/authApi.js";
import { useAuth } from "../../context/AuthContext.jsx";

const roleHomes = {
  hospital: "/hospital/dashboard",
  blood_bank: "/blood-bank/dashboard",
  courier: "/courier/dashboard",
  admin: "/admin/dashboard"
};

const roleMeta = {
  hospital: {
    icon: "H",
    title: "Hospital",
    description: "Sign in to manage emergency requests and live status tracking."
  },
  blood_bank: {
    icon: "B",
    title: "Blood Bank",
    description: "Sign in to manage inventory, accept requests, and dispatch deliveries."
  },
  courier: {
    icon: "C",
    title: "Courier",
    description: "Sign in to view assigned deliveries and update transport status."
  },
  admin: {
    icon: "A",
    title: "Admin",
    description: "Sign in to manage users, monitor activity, and control the platform."
  }
};

const LoginPage = ({ role = "hospital" }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const selectedRole = roleMeta[role] || roleMeta.hospital;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await loginRequest(form);
      const nextUser = response.data.user;

      if (nextUser.role !== role) {
        setError(`This account belongs to ${nextUser.role.replace("_", " ")}. Please choose the correct module.`);
        return;
      }

      login(nextUser, response.data.token);
      navigate(roleHomes[nextUser.role] || "/");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="landing-shell">
      <main className="landing-main">
        <section className="landing-hero">
          <div className="landing-hero__copy">
            <h2>MediLink</h2>
            <p className="landing-hero__tagline">Connecting Care in Real-Time.</p>
          </div>

          <section className="auth-panel">
            <div className="panel-header">
              <h3>Login</h3>
              <span className="pill">{selectedRole.title}</span>
            </div>
            <div className="login-role-card">
              <span className="role-card__icon">{selectedRole.icon}</span>
              <div className="role-card__content">
                <h3>{selectedRole.title}</h3>
                <p>{selectedRole.description}</p>
              </div>
            </div>

            <form className="request-form" onSubmit={handleSubmit}>
              <label>
                Email
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="Enter your registered email"
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, password: event.target.value }))
                  }
                  placeholder="Enter your password"
                />
              </label>
              <button type="submit" className="landing-enter" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Login"}
              </button>
            </form>

            {error ? <p className="landing-error">{error}</p> : null}
            <button type="button" className="login-back-link" onClick={() => navigate("/")}>
              Back to modules
            </button>
          </section>
        </section>
      </main>
    </div>
  );
};

export default LoginPage;
