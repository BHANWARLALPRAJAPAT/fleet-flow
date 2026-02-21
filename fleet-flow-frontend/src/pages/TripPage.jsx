import { useState, useEffect } from "react";
import { Plus, Search, Filter, PlayCircle, CheckCircle, XCircle } from "lucide-react";
import TripTable from "../components/Trip/TripTable";
import TripForm from "../components/Trip/TripForm";
import Modal from "../components/shared/Modal";
import ConfirmDialog from "../components/shared/ConfirmDialog";
import TripStatusFlow from "../components/Trip/TripStatusFlow";
import { tripsApi } from "../api/tripsApi";
import { vehiclesApi } from "../api/vehiclesApi";
import { driversApi } from "../api/driversApi";

export default function TripPage() {
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // { id, action, title, message }
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vehicleData, driverData, tripData] = await Promise.all([
        vehiclesApi.list().catch(() => []),
        driversApi.list().catch(() => []),
        tripsApi.list().catch(() => []),
      ]);

      setVehicles(Array.isArray(vehicleData) ? vehicleData : []);
      setDrivers(Array.isArray(driverData) ? driverData : []);
      setTrips(Array.isArray(tripData) ? tripData : []);
    } catch (err) {
      console.error("Failed to load trip data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = () => {
    setSelectedTrip(null);
    setIsFormOpen(true);
  };

  const handleEdit = (trip) => {
    setSelectedTrip(trip);
    setIsFormOpen(true);
  };

  const handleStatusChange = (trip, newStatus, title, message) => {
    setConfirmAction({
      id: trip.id,
      action: newStatus,
      title,
      message
    });
    setIsConfirmOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedTrip) {
        // No update endpoint exists, so just close the form for now
        // The trip was already created as a draft
      } else {
        await tripsApi.create(formData);
      }
      setIsFormOpen(false);
      fetchData();
    } catch (err) {
      alert("Failed to save trip: " + (err.response?.data?.message || err.message));
    }
  };

  const executeConfirmAction = async () => {
    const { id, action } = confirmAction;
    try {
      if (action === "DISPATCHED") {
        await tripsApi.dispatch(id, {});
      } else if (action === "COMPLETED") {
        await tripsApi.complete(id);
      } else if (action === "CANCELLED") {
        await tripsApi.cancel(id);
      }
      setIsConfirmOpen(false);
      setConfirmAction(null);
      fetchData();
    } catch (err) {
      alert("Failed to update trip status: " + (err.response?.data?.message || err.message));
    }
  };

  const filteredTrips = trips.filter(t => 
    (t.origin || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.destination || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
             Trip Logistics
          </h1>
          <p className="text-slate-500 text-sm">Plan routes, assign assets, and track shipment progress.</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-slate-800 text-white font-semibold rounded-xl shadow-lg shadow-slate-200 transition-all active:scale-95"
        >
          <Plus size={20} />
          Plan New Trip
        </button>
      </div>

      {/* Mini-Stats for Trips */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard icon={<PlayCircle className="text-blue-500" />} label="In Transit" value={trips.filter(t => t.status === 'DISPATCHED').length} />
        <StatCard icon={<CheckCircle className="text-emerald-500" />} label="Completed" value={trips.filter(t => t.status === 'COMPLETED').length} />
        <StatCard icon={<Search className="text-slate-400" />} label="Avg Load" value={trips.length ? Math.round(trips.reduce((a,c) => a + (Number(c.cargoWeightKg) || 0), 0) / trips.length) + 'kg' : '0kg'} />
        <StatCard icon={<XCircle className="text-red-400" />} label="Cancelled" value={trips.filter(t => t.status === 'CANCELLED').length} />
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by origin or destination..."
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
        <div className="py-20 text-center text-slate-400 animate-pulse font-medium">Preparing logistics data...</div>
      ) : (
        <TripTable
          trips={filteredTrips}
          vehicles={vehicles}
          drivers={drivers}
          onEdit={handleEdit}
          onDispatch={(t) => handleStatusChange(t, "DISPATCHED", "Dispatch Shipment", `Assign vehicle and driver for departure to ${t.destination}?`)}
          onComplete={(t) => handleStatusChange(t, "COMPLETED", "Finalize Trip", "Confirm that the shipment has reached its destination safely.")}
          onCancel={(t) => handleStatusChange(t, "CANCELLED", "Cancel Trip", "Are you sure you want to abort this trip? The assets will be released.")}
          onDelete={(t) => setTrips(prev => prev.filter(x => x.id !== t.id))}
        />
      )}

      {/* Modals */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedTrip ? "Modify Trip Details" : "Plan New Shipment"}
        footer={
          <>
            <button
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              form="trip-form"
              type="submit"
              className="px-6 py-2 bg-primary hover:bg-slate-800 text-white text-sm font-semibold rounded-lg transition-all shadow-lg"
            >
              {selectedTrip ? "Save Changes" : "Create Plan"}
            </button>
          </>
        }
      >
        <TripForm
          initialData={selectedTrip}
          vehicles={vehicles}
          drivers={drivers}
          onSubmit={handleFormSubmit}
        />
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => { setIsConfirmOpen(false); setConfirmAction(null); }}
        onConfirm={executeConfirmAction}
        title={confirmAction?.title}
        message={confirmAction?.message}
        type={confirmAction?.action === 'CANCELLED' ? 'danger' : 'primary'}
        confirmLabel={confirmAction?.action === 'CANCELLED' ? 'Cancel Trip' : 'Proceed'}
      />
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
        <p className="text-lg font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
