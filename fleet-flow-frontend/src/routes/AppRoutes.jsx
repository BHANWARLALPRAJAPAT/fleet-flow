import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import AppLayout from '../components/Layout/AppLayout';

import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import VehiclesListPage from '../pages/VehiclesListPage';
import VehicleCreatePage from '../pages/VehicleCreatePage';
import VehicleDetailPage from '../pages/VehicleDetailPage';
import VehicleEditPage from '../pages/VehicleEditPage';
import TripDispatcherPage from '../pages/TripDispatcherPage';
import TripsListPage from '../pages/TripsListPage';
import TripCreatePage from '../pages/TripCreatePage';
import TripDetailPage from '../pages/TripDetailPage';
import MaintenanceListPage from '../pages/MaintenanceListPage';
import MaintenanceCreatePage from '../pages/MaintenanceCreatePage';
import ExpensesListPage from '../pages/ExpensesListPage';
import ExpenseCreatePage from '../pages/ExpenseCreatePage';
import PerformancePage from '../pages/PerformancePage';
import AnalyticsPage from '../pages/AnalyticsPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<Navigate to="/app/dashboard" replace />} />

      {/* Protected Routes */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        
        {/* Vehicles */}
        <Route path="vehicles" element={<VehiclesListPage />} />
        <Route path="vehicles/new" element={<VehicleCreatePage />} />
        <Route path="vehicles/:vehicleId" element={<VehicleDetailPage />} />
        <Route path="vehicles/:vehicleId/edit" element={<VehicleEditPage />} />
        
        {/* Trips */}
        <Route path="trips" element={<TripsListPage />} />
        <Route path="trips/dispatch" element={<TripDispatcherPage />} />
        <Route path="trips/new" element={<TripCreatePage />} />
        <Route path="trips/:tripId" element={<TripDetailPage />} />
        
        {/* Maintenance */}
        <Route path="maintenance" element={<MaintenanceListPage />} />
        <Route path="maintenance/new" element={<MaintenanceCreatePage />} />
        
        {/* Expenses */}
        <Route path="expenses" element={<ExpensesListPage />} />
        <Route path="expenses/new" element={<ExpenseCreatePage />} />
        
        {/* Other */}
        <Route path="performance" element={<PerformancePage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>
      
      {/* Catch-all redirects back to dashboard */}
      <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
    </Routes>
  );
}
