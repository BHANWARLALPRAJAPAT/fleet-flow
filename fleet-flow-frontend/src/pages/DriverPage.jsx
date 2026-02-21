import { useState, useEffect } from "react";
import { ChevronDown, Plus, Search, UserCheck, UserX } from "lucide-react";
import DriverTable from "../components/Driver/DriverTable";
import DriverForm from "../components/Driver/DriverForm";
import Modal from "../components/shared/Modal";
import ConfirmDialog from "../components/shared/ConfirmDialog";
import { useToast } from "../components/shared/Toast";
import { driversApi } from "../api/driversApi";

export default function DriverPage() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  
  // UI State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [safetyFilter, setSafetyFilter] = useState("ALL");

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const data = await driversApi.list();
      setDrivers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load drivers:", err);
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleCreate = () => {
    setSelectedDriver(null);
    setIsFormOpen(true);
  };

  const handleEdit = (driver) => {
    setSelectedDriver(driver);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (driver) => {
    setSelectedDriver(driver);
    setIsConfirmOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedDriver) {
        await driversApi.update(selectedDriver.id, formData);
        toast("Driver updated successfully", "success");
      } else {
        await driversApi.create(formData);
        toast("Driver registered successfully", "success");
      }
      setIsFormOpen(false);
      fetchDrivers();
    } catch (err) {
      toast("Failed to save driver: " + (err.response?.data?.message || err.message), "error");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      // Change status to SUSPENDED as a soft-delete
      await driversApi.changeStatus(selectedDriver.id, "SUSPENDED");
      toast("Driver suspended successfully", "warning");
      setIsConfirmOpen(false);
      fetchDrivers();
    } catch (err) {
      toast("Failed to update driver: " + (err.response?.data?.message || err.message), "error");
    }
  };

  const filteredDrivers = Array.isArray(drivers)
    ? drivers.filter(d => {
        const matchesSearch =
          (d.fullName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
          (d.licenseNo?.toLowerCase() || "").includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || d.status === statusFilter;
        const score = Number(d.safetyScore) || 0;
        const matchesSafety =
          safetyFilter === "ALL" ||
          (safetyFilter === "80_PLUS" && score >= 80) ||
          (safetyFilter === "60_79" && score >= 60 && score < 80) ||
          (safetyFilter === "BELOW_60" && score < 60);
        return matchesSearch && matchesStatus && matchesSafety;
      })
    : [];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            Driver Management
          </h1>
          <p className="text-slate-500 text-sm">Monitor driver performance, certifications, and shift status.</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-slate-800 text-white font-semibold rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-95"
        >
          <Plus size={20} />
          Register Driver
        </button>
      </div>

      {/* Stats Overview (Small Row) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <UserCheck size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Drivers</p>
            <p className="text-xl font-bold text-slate-800">{Array.isArray(drivers) ? drivers.filter(d => d.status !== 'OFF_DUTY' && d.status !== 'SUSPENDED').length : 0}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
            <UserX size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Suspended</p>
            <p className="text-xl font-bold text-slate-800">{Array.isArray(drivers) ? drivers.filter(d => d.status === 'SUSPENDED').length : 0}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
            <Search size={20} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Avg Safety Score</p>
            <p className="text-xl font-bold text-slate-800">
              {Array.isArray(drivers) && drivers.length ? Math.round(drivers.reduce((acc, curr) => acc + (Number(curr.safetyScore) || 0), 0) / drivers.length) : 0}
            </p>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search driver name or license..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all shadow-sm"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            <option value="ALL">All Status</option>
            <option value="ON_DUTY">On Duty</option>
            <option value="OFF_DUTY">Off Duty</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
        <div className="relative">
          <select
            value={safetyFilter}
            onChange={(e) => setSafetyFilter(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            <option value="ALL">All Safety</option>
            <option value="80_PLUS">80+ Score</option>
            <option value="60_79">60-79 Score</option>
            <option value="BELOW_60">Below 60</option>
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
        <button
          onClick={() => {
            setSearchQuery("");
            setStatusFilter("ALL");
            setSafetyFilter("ALL");
          }}
          className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
        >
          Clear
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 animate-pulse font-medium">Loading driver records...</div>
      ) : (
        <DriverTable
          drivers={filteredDrivers}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Modals */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedDriver ? "Edit Driver Details" : "Register New Driver"}
        footer={
          <>
            <button
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              form="driver-form"
              type="submit"
              className="px-6 py-2 bg-primary hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-all shadow-lg"
            >
              Save Driver
            </button>
          </>
        }
      >
        <DriverForm
          initialData={selectedDriver}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Suspend Driver"
        message={`Are you sure you want to suspend ${selectedDriver?.fullName}? Their status will be changed to SUSPENDED.`}
      />
    </div>
  );
}
