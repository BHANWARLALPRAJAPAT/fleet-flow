import { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function TripForm({ initialData, vehicles, drivers, onSubmit }) {
  const [formData, setFormData] = useState({
    vehicleId: "",
    driverId: "",
    origin: "",
    destination: "",
    cargoWeight: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        vehicleId: initialData.vehicleId || "",
        driverId: initialData.driverId || "",
        origin: initialData.origin || "",
        destination: initialData.destination || "",
        cargoWeight: initialData.cargoWeight || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error on change
  };

  const selectedVehicle = vehicles.find(v => v.id.toString() === formData.vehicleId);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation: Cargo Weight vs Vehicle Capacity
    if (selectedVehicle && Number(formData.cargoWeight) > selectedVehicle.capacity) {
      setError(`Cargo weight exceeds vehicle capacity (${selectedVehicle.capacity.toLocaleString()} kg)`);
      return;
    }

    onSubmit({
      ...formData,
      vehicleId: Number(formData.vehicleId),
      driverId: Number(formData.driverId),
      cargoWeight: Number(formData.cargoWeight),
    });
  };

  return (
    <form id="trip-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Vehicle Selection */}
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Assign Vehicle</label>
          <select
            name="vehicleId"
            value={formData.vehicleId}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none"
            required
          >
            <option value="">Select a vehicle...</option>
            {vehicles
              .filter(v => v.status === "AVAILABLE" || (initialData && v.id === initialData.vehicleId))
              .map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.type}) - Cap: {v.capacity.toLocaleString()} kg
                </option>
              ))}
          </select>
        </div>

        {/* Driver Selection */}
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Assign Driver</label>
          <select
            name="driverId"
            value={formData.driverId}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none"
            required
          >
            <option value="">Select a driver...</option>
            {drivers
              .filter(d => d.status === "ON_DUTY" || (initialData && d.id === initialData.driverId))
              .map(d => (
                <option key={d.id} value={d.id}>
                  {d.fullName} (Score: {d.safetyScore})
                </option>
              ))}
          </select>
        </div>

        {/* Origin & Destination */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Origin</label>
          <input
            type="text"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            placeholder="e.g. Warehouse A"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Destination</label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="e.g. Retail Store #5"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            required
          />
        </div>

        {/* Cargo Weight */}
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Cargo Weight (kg)</label>
          <div className="relative">
            <input
              type="number"
              name="cargoWeight"
              value={formData.cargoWeight}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 bg-slate-50 border ${error ? 'border-red-500' : 'border-slate-200'} rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all`}
              required
              min="1"
            />
            {selectedVehicle && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">
                Max: {selectedVehicle.capacity.toLocaleString()} kg
              </span>
            )}
          </div>
          {error && (
            <div className="flex items-center gap-1.5 mt-2 text-red-500 text-xs font-medium bg-red-50 p-2 rounded-lg border border-red-100">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
