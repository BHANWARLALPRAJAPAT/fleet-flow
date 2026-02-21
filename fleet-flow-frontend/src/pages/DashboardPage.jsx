import { useState, useEffect } from "react";
import { Truck, Wrench, BarChart3, Package, Bell } from "lucide-react";
import KpiCard from "../components/Dashboard/KpiCard";
import FilterBar from "../components/Dashboard/FilterBar";
import api from "../api/axiosClient";
import "../styles/dashboard.css";

export default function DashboardPage() {
  const [kpis, setKpis] = useState({
    activeFleet: 0,
    maintenanceAlerts: 0,
    utilizationRate: "0%",
    pendingCargo: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: "ALL", status: "ALL", search: "" });

  useEffect(() => {
    const fetchKpis = async () => {
      setLoading(true);
      try {
        const res = await api.get("/dashboard/kpis", { params: filters });
        setKpis(res.data);
      } catch (err) {
        console.warn("Backend KPI endpoint not found, using mock data");
        // Mock data for F3 demonstration
        setKpis({
          activeFleet: 12,
          maintenanceAlerts: 3,
          utilizationRate: "84%",
          pendingCargo: 7,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchKpis();
  }, [filters]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <h2>Command Center</h2>
          <p style={{ fontSize: "14px", color: "#64748b" }}>
            Real-time fleet performance overview
          </p>
        </div>
        <FilterBar onFilterChange={handleFilterChange} />
      </div>

      <div className="kpi-grid">
        <KpiCard
          title="Active Fleet"
          value={kpis.activeFleet}
          icon={Truck}
          colorClass="blue"
          trend="up"
          trendValue="12%"
        />
        <KpiCard
          title="Maintenance"
          value={kpis.maintenanceAlerts}
          icon={Wrench}
          colorClass="orange"
          trend="down"
          trendValue="2"
        />
        <KpiCard
          title="Utilization"
          value={kpis.utilizationRate}
          icon={BarChart3}
          colorClass="green"
          trend="up"
          trendValue="5.4%"
        />
        <KpiCard
          title="Pending Cargo"
          value={kpis.pendingCargo}
          icon={Package}
          colorClass="purple"
          trend="up"
          trendValue="3"
        />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-panel">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
            <h3 style={{ fontSize: "18px", color: "#1e293b" }}>Fleet Activity</h3>
            <span style={{ fontSize: "12px", background: "#f1f5f9", padding: "4px 8px", borderRadius: "12px", color: "#64748b" }}>Live Updates</span>
          </div>
          <p style={{ color: "#94a3b8", textAlign: "center", marginTop: "80px" }}>
            Detailed activity charts coming in Feature F10 (Reports & Analytics).
          </p>
        </div>
        
        <div className="dashboard-panel">
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
            <Bell size={18} color="#f97316" />
            <h3 style={{ fontSize: "18px", color: "#1e293b" }}>Recent Alerts</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              { id: 1, text: "Vehicle V-102 due for oil change", type: "maintenance" },
              { id: 2, text: "Driver John reached daily limit", type: "safety" },
              { id: 3, text: "Fuel spike detected in Trip #405", type: "expense" }
            ].map(alert => (
              <div key={alert.id} style={{ padding: "12px", background: "#fffaf5", border: "1px solid #ffedd5", borderRadius: "8px", fontSize: "13px", color: "#9a3412" }}>
                {alert.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
