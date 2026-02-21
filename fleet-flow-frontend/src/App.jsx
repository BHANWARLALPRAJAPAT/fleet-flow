import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/Layout/AppLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import VehiclePage from "./pages/VehiclePage";
import DriverPage from "./pages/DriverPage";
import TripPage from "./pages/TripPage";
import MaintenancePage from "./pages/MaintenancePage";
import FuelLogPage from "./pages/FuelLogPage";
import ExpensePage from "./pages/ExpensePage";
import ReportsPage from "./pages/ReportsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route — no layout */}
        <Route path="/login" element={<LoginPage />} />

        {/* Authenticated routes — wrapped in AppLayout */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/vehicles" element={<VehiclePage />} />
          <Route path="/drivers" element={<DriverPage />} />
          <Route path="/trips" element={<TripPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/fuel-logs" element={<FuelLogPage />} />
          <Route path="/expenses" element={<ExpensePage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
