import { useState, useEffect } from "react";

export default function FuelLogForm({ vehicles, onSubmit }) {
  const [formData, setFormData] = useState({
    vehicleId: "",
    liters: "",
    amount: "",
    odometerKm: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      vehicle: `/vehicles/${formData.vehicleId}`,
      type: "FUEL",
      liters: Number(formData.liters) || null,
      amount: Number(formData.amount),
      odometerKm: formData.odometerKm ? Number(formData.odometerKm) : null,
      description: formData.description,
    });
  };

  return (
    <form id="fuel-log-form" onSubmit={handleSubmit} className="space-y-4">
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
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Liters *</label>
          <input
            type="number"
            name="liters"
            value={formData.liters}
            onChange={handleChange}
            step="0.1"
            min="0.1"
            placeholder="45.5"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Cost ($) *</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0.01"
            placeholder="75.00"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Odometer (km)</label>
          <input
            type="number"
            name="odometerKm"
            value={formData.odometerKm}
            onChange={handleChange}
            placeholder="Optional"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Notes</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="2"
            placeholder="Station, pump #..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none"
          />
        </div>
      </div>
    </form>
  );
}
