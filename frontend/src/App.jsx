import { Navigate, useLocation } from "react-router-dom";

import AppRouter from "./routes/AppRouter.jsx";
import { useAuth } from "./context/AuthContext.jsx";

const roleLoginPaths = new Set([
  "/hospital/login",
  "/blood-bank/login",
  "/courier/login",
  "/admin/login"
]);

const App = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user && location.pathname !== "/" && !roleLoginPaths.has(location.pathname)) {
    const [firstSegment] = location.pathname.split("/").filter(Boolean);
    const rolePath =
      firstSegment === "blood-bank"
        ? "/blood-bank/login"
        : firstSegment === "hospital"
          ? "/hospital/login"
          : firstSegment === "courier"
            ? "/courier/login"
            : firstSegment === "admin"
              ? "/admin/login"
              : "/";

    return <Navigate to={rolePath} replace />;
  }

  return <AppRouter />;
};

export default App;
