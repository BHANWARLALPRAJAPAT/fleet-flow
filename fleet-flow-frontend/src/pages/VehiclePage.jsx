import { useState, useEffect } from "react";
import { Plus, Search, Filter } from "lucide-react";
import VehicleTable from "../components/Vehicle/VehicleTable";
import VehicleForm from "../components/Vehicle/VehicleForm";
import Modal from "../components/shared/Modal";
import ConfirmDialog from "../components/shared/ConfirmDialog";
import { vehiclesApi } from "../api/vehiclesApi";

export default function VehiclePage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

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
      } else {
        await vehiclesApi.create(formData);
      }
      setIsFormOpen(false);
      fetchVehicles();
    } catch (err) {
      alert("Failed to save vehicle: " + (err.response?.data?.message || err.message));
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await vehiclesApi.retire(selectedVehicle.id);
      setIsConfirmOpen(false);
      fetchVehicles();
    } catch (err) {
      alert("Failed to retire vehicle: " + (err.response?.data?.message || err.message));
    }
  };

  const filteredVehicles = Array.isArray(vehicles) 
    ? vehicles.filter(v => 
        (v.nameModel?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (v.licensePlate?.toLowerCase() || "").includes(searchQuery.toLowerCase())
      )
    : [];

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
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
          <Filter size={18} />
          <span>Filters</span>
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
