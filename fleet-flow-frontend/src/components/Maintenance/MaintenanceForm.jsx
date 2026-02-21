import { useState, useEffect } from "react";

const MAINTENANCE_TYPES = ["PREVENTIVE", "REACTIVE", "INSPECTION", "OTHER"];

export default function MaintenanceForm({ initialData, vehicles, onSubmit }) {
  const [formData, setFormData] = useState({
    vehicleId: "",
    type: "PREVENTIVE",
    logDate: new Date().toISOString().split("T")[0],
    cost: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        vehicleId: initialData.vehicle?.id || initialData.vehicleId || "",
        type: initialData.type || "PREVENTIVE",
        logDate: initialData.logDate || new Date().toISOString().split("T")[0],
        cost: initialData.cost || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      vehicle: `/vehicles/${formData.vehicleId}`,
      type: formData.type,
      logDate: formData.logDate,
      cost: Number(formData.cost) || 0,
      description: formData.description,
    });
  };

  return (
    <form id="maintenance-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Vehicle *</label>
          <select
            name="vehicleId"
            value={formData.vehicleId}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none"
            required
          >
            <option value="">Select a vehicle…</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.nameModel} ({v.licensePlate})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Service Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none"
          >
            {MAINTENANCE_TYPES.map((t) => (
              <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Service Date *</label>
          <input
            type="date"
            name="logDate"
            value={formData.logDate}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Cost ($)</label>
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Service details..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none"
          />
        </div>
      </div>
    </form>
  );
}
