import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import { AdminProvider } from "./context/AdminContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BloodBankProvider } from "./context/BloodBankContext.jsx";
import { CourierProvider } from "./context/CourierContext.jsx";
import { HospitalProvider } from "./context/HospitalContext.jsx";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <HospitalProvider>
          <BloodBankProvider>
            <CourierProvider>
              <AdminProvider>
                <App />
              </AdminProvider>
            </CourierProvider>
          </BloodBankProvider>
        </HospitalProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
