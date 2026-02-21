import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/Layout/AppLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import VehiclePage from "./pages/VehiclePage";
import DriverPage from "./pages/DriverPage";
import TripPage from "./pages/TripPage";
import MaintenancePage from "./pages/MaintenancePage";
import FuelLogPage from "./pages/FuelLogPage";
import ExpensePage from "./pages/ExpensePage";
import ReportsPage from "./pages/ReportsPage";
import NotFoundPage from "./pages/NotFoundPage";
import { ToastProvider } from "./components/shared/Toast";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
        <Routes>
          {/* Public routes — no layout */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected routes — wrapped in layout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/vehicles" element={<VehiclePage />} />
            <Route path="/drivers" element={<DriverPage />} />
            <Route path="/trips" element={<TripPage />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/fuel-logs" element={<FuelLogPage />} />
            <Route path="/expenses" element={<ExpensePage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Route>

          {/* 404 catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

