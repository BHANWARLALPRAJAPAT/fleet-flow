import { useState, useEffect } from "react";
import { Plus, Search, Filter, DollarSign, TrendingUp } from "lucide-react";
import ExpenseTable from "../components/Expense/ExpenseTable";
import ExpenseForm from "../components/Expense/ExpenseForm";
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

export default function ExpensePage() {
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [expData, vData] = await Promise.all([
        expensesApi.list().catch(() => []),
        vehiclesApi.list().catch(() => []),
      ]);
      const vList = Array.isArray(vData) ? vData : [];
      setVehicles(vList);

      const rawExpenses = Array.isArray(expData) ? expData : [];
      const resolved = await resolveVehicleLinks(rawExpenses, vList);
      setExpenses(resolved);
    } catch (err) {
      console.error("Failed to load expenses:", err);
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
      alert("Failed to add expense: " + (err.response?.data?.message || err.message));
    }
  };

  const totalAmount = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const typeCounts = expenses.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1;
    return acc;
  }, {});
  const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];

  const filteredExpenses = expenses.filter((e) => {
    const vid = e.vehicleId || e.vehicle?.id || (e._links?.vehicle?.href?.split("/").pop());
    const vehicleName = e.vehicleName || (vid && vehicles.find(v => String(v.id) === String(vid))?.nameModel) || "";
    return (
      vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.type || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">💰 Expense Tracking</h1>
          <p className="text-slate-500 text-sm">Categorized expense records linked to vehicles.</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-slate-800 text-white font-semibold rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-95"
        >
          <Plus size={20} />
          Add Expense
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
            <DollarSign size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Entries</p>
            <p className="text-xl font-bold text-slate-800">{expenses.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <DollarSign size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Spend</p>
            <p className="text-xl font-bold text-slate-800">${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Top Category</p>
            <p className="text-xl font-bold text-slate-800">{topType ? topType[0] : "—"}</p>
          </div>
        </div>
      </div>

      {/* Search */}
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
        <div className="py-20 text-center text-slate-400 animate-pulse font-medium">Loading expenses...</div>
      ) : (
        <ExpenseTable expenses={filteredExpenses} vehicles={vehicles} />
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Add Expense"
        footer={
          <>
            <button onClick={() => setIsFormOpen(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            <button form="expense-form" type="submit" className="px-6 py-2 bg-primary hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-slate-200">Save Expense</button>
          </>
        }
      >
        <ExpenseForm vehicles={vehicles} onSubmit={handleFormSubmit} />
      </Modal>
    </div>
  );
}
