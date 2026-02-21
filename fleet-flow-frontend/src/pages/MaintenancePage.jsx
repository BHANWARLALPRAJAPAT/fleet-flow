import { useState, useEffect } from "react";
import { Plus, Search, Filter, Wrench } from "lucide-react";
import MaintenanceTable from "../components/Maintenance/MaintenanceTable";
import MaintenanceForm from "../components/Maintenance/MaintenanceForm";
import Modal from "../components/shared/Modal";
import { maintenanceApi } from "../api/maintenanceApi";
import { vehiclesApi } from "../api/vehiclesApi";
import api from "../api/axiosClient";
import { extractId } from "../api/hateoasUtils";

/** Follow each item's _links.vehicle.href → get the vehicle entity → extract its ID */
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

export default function MaintenancePage() {
  const [logs, setLogs] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [logData, vehicleData] = await Promise.all([
        maintenanceApi.list().catch(() => []),
        vehiclesApi.list().catch(() => []),
      ]);
      const vList = Array.isArray(vehicleData) ? vehicleData : [];
      setVehicles(vList);

      // Resolve vehicle IDs by following each log's _links.vehicle.href
      const rawLogs = Array.isArray(logData) ? logData : [];
      const resolvedLogs = await resolveVehicleLinks(rawLogs, vList);
      setLogs(resolvedLogs);
    } catch (err) {
      console.error("Failed to load maintenance data:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const handleFormSubmit = async (formData) => {
    try {
      await maintenanceApi.create(formData);
      setIsFormOpen(false);
      fetchData();
    } catch (err) {
      alert("Failed to log maintenance: " + (err.response?.data?.message || err.message));
    }
  };

  // Stats
  const totalCost = logs.reduce((sum, l) => sum + (Number(l.cost) || 0), 0);
  const thisMonth = logs.filter((l) => {
    if (!l.logDate) return false;
    const d = new Date(l.logDate);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const filteredLogs = logs.filter((l) => {
    const vid = l.vehicleId || l.vehicle?.id || (l._links?.vehicle?.href?.split("/").pop());
    const vehicleName = l.vehicleName || (vid && vehicles.find(v => String(v.id) === String(vid))?.nameModel) || "";
    return (
      vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.type || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            🔧 Maintenance Logs
          </h1>
          <p className="text-slate-500 text-sm">Log and track vehicle maintenance and repair history.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-slate-800 text-white font-semibold rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-95"
        >
          <Plus size={20} />
          Log Maintenance
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
            <Wrench size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Logs</p>
            <p className="text-xl font-bold text-slate-800">{logs.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
            <Wrench size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">This Month</p>
            <p className="text-xl font-bold text-slate-800">{thisMonth}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <Wrench size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Cost</p>
            <p className="text-xl font-bold text-slate-800">
              ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search vehicle, type, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
          <Filter size={18} />
          <span>Filters</span>
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 animate-pulse font-medium">Loading maintenance records...</div>
      ) : (
        <MaintenanceTable logs={filteredLogs} vehicles={vehicles} />
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Log Maintenance"
        footer={
          <>
            <button
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              form="maintenance-form"
              type="submit"
              className="px-6 py-2 bg-primary hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-slate-200"
            >
              Save Log
            </button>
          </>
        }
      >
        <MaintenanceForm vehicles={vehicles} onSubmit={handleFormSubmit} />
      </Modal>
    </div>
  );
}
