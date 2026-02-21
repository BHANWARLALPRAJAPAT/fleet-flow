import { useState, useEffect } from "react";
import { Plus, Search, Filter, Fuel } from "lucide-react";
import FuelLogTable from "../components/FuelLog/FuelLogTable";
import FuelLogForm from "../components/FuelLog/FuelLogForm";
import Modal from "../components/shared/Modal";
import { expensesApi } from "../api/expensesApi";
import { vehiclesApi } from "../api/vehiclesApi";
import api from "../api/axiosClient";
import { extractId } from "../api/hateoasUtils";

async function resolveVehicleLinks(items, vehicles) {
  return Promise.all(
    items.map(async (item) => {
      const vehicleHref = item._links?.vehicle?.href;
      if (!vehicleHref) return item;
      try {
        const res = await api.get(vehicleHref);
        const vid = extractId(res.data);
        const v = vehicles.find(v => v.id === vid);
        return { ...item, vehicleId: vid, vehicleName: v?.nameModel || `Vehicle ${vid}` };
      } catch {
        return item;
      }
    })
  );
}

export default function FuelLogPage() {
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [expenseData, vehicleData] = await Promise.all([
        expensesApi.list().catch(() => []),
        vehiclesApi.list().catch(() => []),
      ]);
      const vList = Array.isArray(vehicleData) ? vehicleData : [];
      setVehicles(vList);

      // Filter to FUEL type only, then resolve vehicle links
      const fuelOnly = (Array.isArray(expenseData) ? expenseData : []).filter(e => e.type === "FUEL");
      const resolved = await resolveVehicleLinks(fuelOnly, vList);
      setLogs(resolved);
    } catch (err) {
      console.error("Failed to load fuel logs:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const handleFormSubmit = async (formData) => {
    try {
      await expensesApi.create(formData);
      setIsFormOpen(false);
      fetchData();
    } catch (err) {
      alert("Failed to log fuel: " + (err.response?.data?.message || err.message));
    }
  };

  const totalLiters = logs.reduce((sum, l) => sum + (Number(l.liters) || 0), 0);
  const totalCost = logs.reduce((sum, l) => sum + (Number(l.amount) || 0), 0);

  const filteredLogs = logs.filter((l) => {
    const vid = l.vehicleId || l.vehicle?.id || (l._links?.vehicle?.href?.split("/").pop());
    const vehicleName = l.vehicleName || (vid && vehicles.find(v => String(v.id) === String(vid))?.nameModel) || "";
    return vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.description || "").toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">⛽ Fuel Logs</h1>
          <p className="text-slate-500 text-sm">Track fuel consumption and costs per vehicle.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-slate-800 text-white font-semibold rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-95"
        >
          <Plus size={20} />
          Log Fuel
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">⛽</div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Entries</p>
            <p className="text-xl font-bold text-slate-800">{logs.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">🛢️</div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Liters</p>
            <p className="text-xl font-bold text-slate-800">{totalLiters.toLocaleString(undefined, { minimumFractionDigits: 1 })} L</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">💰</div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Spend</p>
            <p className="text-xl font-bold text-slate-800">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search vehicle or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 animate-pulse font-medium">Loading fuel logs...</div>
      ) : (
        <FuelLogTable logs={filteredLogs} vehicles={vehicles} />
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Log Fuel"
        footer={
          <>
            <button onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            <button form="fuel-log-form" type="submit" className="px-6 py-2 bg-primary hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-slate-200">Save</button>
          </>
        }
      >
        <FuelLogForm vehicles={vehicles} onSubmit={handleFormSubmit} />
      </Modal>
    </div>
  );
}
