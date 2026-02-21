import { useState, useEffect } from "react";
import { ChevronDown, Plus, Search } from "lucide-react";
import VehicleTable from "../components/Vehicle/VehicleTable";
import VehicleForm from "../components/Vehicle/VehicleForm";
import Modal from "../components/shared/Modal";
import ConfirmDialog from "../components/shared/ConfirmDialog";
import { useToast } from "../components/shared/Toast";
import { vehiclesApi } from "../api/vehiclesApi";

export default function VehiclePage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  
  // UI State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [regionFilter, setRegionFilter] = useState("ALL");

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const data = await vehiclesApi.list();
      setVehicles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load vehicles:", err);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleCreate = () => {
    setSelectedVehicle(null);
    setIsFormOpen(true);
  };

  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsConfirmOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedVehicle) {
        await vehiclesApi.update(selectedVehicle.id, formData);
        toast("Vehicle updated successfully", "success");
      } else {
        await vehiclesApi.create(formData);
        toast("Vehicle created successfully", "success");
      }
      setIsFormOpen(false);
      fetchVehicles();
    } catch (err) {
      toast("Failed to save vehicle: " + (err.response?.data?.message || err.message), "error");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await vehiclesApi.retire(selectedVehicle.id);
      toast("Vehicle retired successfully", "success");
      setIsConfirmOpen(false);
      fetchVehicles();
    } catch (err) {
      toast("Failed to retire vehicle: " + (err.response?.data?.message || err.message), "error");
    }
  };

  const filteredVehicles = Array.isArray(vehicles) 
    ? vehicles.filter(v => {
        const matchesSearch =
          (v.nameModel?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
          (v.licensePlate?.toLowerCase() || "").includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "ALL" || v.status === statusFilter;
        const matchesType = typeFilter === "ALL" || v.type === typeFilter;
        const matchesRegion = regionFilter === "ALL" || (v.region || "") === regionFilter;
        return matchesSearch && matchesStatus && matchesType && matchesRegion;
      })
    : [];

  const regionOptions = Array.from(
    new Set(
      (Array.isArray(vehicles) ? vehicles : [])
        .map((v) => (v.region || "").trim())
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Vehicle Registry</h1>
          <p className="text-slate-500 text-sm">Manage your fleet inventory and maintenance status.</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-slate-800 text-white font-semibold rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-95"
        >
          <Plus size={20} />
          Add Vehicle
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search name or license plate..."
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
            <option value="AVAILABLE">Available</option>
            <option value="ON_TRIP">On Trip</option>
            <option value="IN_SHOP">In Shop</option>
            <option value="OUT_OF_SERVICE">Out of Service</option>
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            <option value="ALL">All Types</option>
            <option value="TRUCK">Truck</option>
            <option value="VAN">Van</option>
            <option value="BIKE">Bike</option>
            <option value="OTHER">Other</option>
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
        <div className="relative">
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            <option value="ALL">All Regions</option>
            {regionOptions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
        <button
          onClick={() => {
            setSearchQuery("");
            setStatusFilter("ALL");
            setTypeFilter("ALL");
            setRegionFilter("ALL");
          }}
          className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
        >
          Clear
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 animate-pulse">Loading vehicles...</div>
      ) : (
        <VehicleTable
          vehicles={filteredVehicles}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      {/* Modals */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedVehicle ? "Edit Vehicle" : "Add New Vehicle"}
        footer={
          <>
            <button
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              form="vehicle-form"
              type="submit"
              className="px-6 py-2 bg-primary hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-slate-200"
            >
              Save Vehicle
            </button>
          </>
        }
      >
        <VehicleForm
          initialData={selectedVehicle}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Retire Vehicle"
        message={`Are you sure you want to retire ${selectedVehicle?.nameModel}? This action cannot be undone.`}
      />
    </div>
  );
}
