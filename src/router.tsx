import { createBrowserRouter } from "react-router-dom";
import { LoginPage } from "./features/auth/LoginPage";
import { PortfolioDashboard } from "./features/portfolio/pages/PortfolioDashboard";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { DashboardLayout } from "./components/layout/DashboardLayout";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <PortfolioDashboard />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <PortfolioDashboard />
        </DashboardLayout>
      </ProtectedRoute>
    ),
  },
]);
