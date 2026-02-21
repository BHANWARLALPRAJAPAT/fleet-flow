import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from "recharts";
import { expensesApi } from "../api/expensesApi";
import { maintenanceApi } from "../api/maintenanceApi";
import { tripsApi } from "../api/tripsApi";
import { vehiclesApi } from "../api/vehiclesApi";

const TABS = ["Expense Breakdown", "Maintenance Cost", "Trips Over Time"];

const PIE_COLORS = ["#3b82f6", "#f97316", "#a855f7", "#10b981", "#6366f1", "#94a3b8"];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expenseData, setExpenseData] = useState([]);
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [tripData, setTripData] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [expenses, maintenance, trips, vehicles] = await Promise.all([
          expensesApi.list().catch(() => []),
          maintenanceApi.list().catch(() => []),
          tripsApi.list().catch(() => []),
          vehiclesApi.list().catch(() => []),
        ]);

        // Expense Breakdown — aggregate by type
        const expByType = {};
        (Array.isArray(expenses) ? expenses : []).forEach((e) => {
          const t = e.type || "OTHER";
          expByType[t] = (expByType[t] || 0) + (Number(e.amount) || 0);
        });
        setExpenseData(Object.entries(expByType).map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 })));

        // Maintenance Cost per Vehicle
        const vMap = {};
        (Array.isArray(vehicles) ? vehicles : []).forEach(v => { vMap[v.id] = v.nameModel; });
        const maintByVehicle = {};
        (Array.isArray(maintenance) ? maintenance : []).forEach((m) => {
          let vid = m.vehicleId || m.vehicle?.id;
          if (!vid && m._links?.vehicle?.href) {
            vid = m._links.vehicle.href.split("/").pop();
          }
          const name = (vid && vMap[vid]) || `Vehicle ${vid || '?'}`;
          maintByVehicle[name] = (maintByVehicle[name] || 0) + (Number(m.cost) || 0);
        });
        setMaintenanceData(Object.entries(maintByVehicle).map(([name, cost]) => ({ name, cost: Math.round(cost * 100) / 100 })));

        // Trips Over Time — aggregate by month
        const tripsByMonth = {};
        (Array.isArray(trips) ? trips : []).forEach((t) => {
          const date = t.createdAt || t.dispatchedAt;
          if (!date) return;
          const d = new Date(date);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
          tripsByMonth[key] = (tripsByMonth[key] || 0) + 1;
        });
        setTripData(
          Object.entries(tripsByMonth)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([month, count]) => ({ month, count }))
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">📊 Analytics & Reports</h1>
        <p className="text-slate-500 text-sm">Fleet performance analysis with interactive charts.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {TABS.map((tab, idx) => (
          <button
            key={tab}
            onClick={() => setActiveTab(idx)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === idx
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Chart Area */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-80 text-slate-400 animate-pulse font-medium">
            Loading analytics data...
          </div>
        ) : (
          <>
            {activeTab === 0 && <ExpenseBreakdownChart data={expenseData} />}
            {activeTab === 1 && <MaintenanceCostChart data={maintenanceData} />}
            {activeTab === 2 && <TripVolumeChart data={tripData} />}
          </>
        )}
      </div>
    </div>
  );
}

function ExpenseBreakdownChart({ data }) {
  if (data.length === 0) return <EmptyChart message="No expense data available" />;
  return (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-4">Expense Distribution by Type</h3>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={130}
            innerRadius={60}
            paddingAngle={3}
            label={({ name, value }) => `${name}: $${value.toLocaleString()}`}
          >
            {data.map((_, idx) => (
              <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(val) => `$${Number(val).toLocaleString()}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function MaintenanceCostChart({ data }) {
  if (data.length === 0) return <EmptyChart message="No maintenance data available" />;
  return (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-4">Maintenance Cost per Vehicle</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
          <YAxis tick={{ fontSize: 12, fill: "#64748b" }} />
          <Tooltip formatter={(val) => `$${Number(val).toLocaleString()}`} />
          <Bar dataKey="cost" fill="#f97316" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function TripVolumeChart({ data }) {
  if (data.length === 0) return <EmptyChart message="No trip data available" />;
  return (
    <div>
      <h3 className="text-lg font-bold text-slate-800 mb-4">Trip Volume Over Time</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} />
          <YAxis tick={{ fontSize: 12, fill: "#64748b" }} allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 5, fill: "#3b82f6" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function EmptyChart({ message }) {
  return (
    <div className="flex items-center justify-center h-80 text-slate-400">
      <div className="text-center">
        <p className="text-4xl mb-2">📉</p>
        <p className="font-medium">{message}</p>
        <p className="text-xs mt-1">Add some data to see charts appear here.</p>
      </div>
    </div>
  );
}
