import { useEffect, useMemo, useState } from "react";

import { register as registerRequest } from "../../api/authApi.js";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import { useAdmin } from "../../context/AdminContext.jsx";

const PAGE_SIZE = 5;
const creatableRoles = [
  { value: "hospital", label: "Hospital" },
  { value: "blood_bank", label: "Blood Bank" },
  { value: "courier", label: "Courier" }
];

const AdminUsersPage = () => {
  const { users, toggleUser, removeUser, refreshAll } = useAdmin();
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [registerForm, setRegisterForm] = useState({
    role: "hospital",
    name: "",
    organizationName: "",
    email: "",
    password: "",
    phone: "",
    address: ""
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerFeedback, setRegisterFeedback] = useState({ type: "", message: "" });

  const filtered = useMemo(
    () => users.filter((item) => (roleFilter === "all" ? true : item.role === roleFilter)),
    [roleFilter, users]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    refreshAll();
  }, []);

  const handleRegisterChange = (field, value) => {
    setRegisterForm((current) => ({ ...current, [field]: value }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setIsRegistering(true);
    setRegisterFeedback({ type: "", message: "" });

    try {
      await registerRequest(registerForm);
      setRegisterFeedback({
        type: "success",
        message: `${creatableRoles.find((item) => item.value === registerForm.role)?.label || "User"} account created successfully.`
      });
      setRegisterForm({
        role: "hospital",
        name: "",
        organizationName: "",
        email: "",
        password: "",
        phone: "",
        address: ""
      });
      await refreshAll();
    } catch (error) {
      setRegisterFeedback({
        type: "error",
        message: error.response?.data?.message || "Unable to create the new account right now."
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <DashboardLayout>
      <section className="panel span-3">
        <div className="panel-header">
          <h3>Register New Module User</h3>
          <span className="pill">Hospital, blood bank, courier only</span>
        </div>
        <form className="request-form" onSubmit={handleRegister}>
          <div className="content-grid">
            <label>
              Role
              <select
                value={registerForm.role}
                onChange={(event) => handleRegisterChange("role", event.target.value)}
              >
                {creatableRoles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Contact Name
              <input
                type="text"
                value={registerForm.name}
                onChange={(event) => handleRegisterChange("name", event.target.value)}
                placeholder="Enter user name"
              />
            </label>
            <label>
              Organization Name
              <input
                type="text"
                value={registerForm.organizationName}
                onChange={(event) => handleRegisterChange("organizationName", event.target.value)}
                placeholder="Enter organization name"
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={registerForm.email}
                onChange={(event) => handleRegisterChange("email", event.target.value)}
                placeholder="Enter official email"
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={registerForm.password}
                onChange={(event) => handleRegisterChange("password", event.target.value)}
                placeholder="Minimum 8 characters"
              />
            </label>
            <label>
              Phone
              <input
                type="text"
                value={registerForm.phone}
                onChange={(event) => handleRegisterChange("phone", event.target.value)}
                placeholder="Enter contact number"
              />
            </label>
            <label className="span-2">
              Address
              <input
                type="text"
                value={registerForm.address}
                onChange={(event) => handleRegisterChange("address", event.target.value)}
                placeholder="Enter service address"
              />
            </label>
          </div>
          <div className="inline-actions">
            <button type="submit" className="ghost-button" disabled={isRegistering}>
              {isRegistering ? "Creating account..." : "Create Account"}
            </button>
          </div>
        </form>
        {registerFeedback.message ? (
          <p
            className={`form-feedback ${
              registerFeedback.type === "error" ? "form-feedback--error" : "form-feedback--success"
            }`}
          >
            {registerFeedback.message}
          </p>
        ) : null}
      </section>
      <section className="panel span-3">
        <div className="panel-header">
          <h3>User Management</h3>
          <span className="pill">Activate, deactivate, delete</span>
        </div>
        <div className="filter-bar">
          <label>
            Role
            <select value={roleFilter} onChange={(event) => { setRoleFilter(event.target.value); setPage(1); }}>
              <option value="all">All</option>
              <option value="hospital">Hospital</option>
              <option value="blood_bank">Blood Bank</option>
              <option value="courier">Courier</option>
              <option value="admin">Admin</option>
            </select>
          </label>
        </div>
        <div className="request-table">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.length ? (
                visible.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.role}</td>
                    <td>{item.is_active ? "Active" : "Inactive"}</td>
                    <td>
                      <div className="inline-actions">
                        <button
                          type="button"
                          className="ghost-button compact-button"
                          onClick={() => toggleUser(item.id, !item.is_active)}
                        >
                          {item.is_active ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          type="button"
                          className="ghost-button compact-button compact-button--muted"
                          onClick={() => removeUser(item.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="request-table__empty">
                    No users found for the selected role.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="pagination-bar">
          <button type="button" className="ghost-button" onClick={() => setPage((current) => Math.max(1, current - 1))}>
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button type="button" className="ghost-button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>
            Next
          </button>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default AdminUsersPage;
