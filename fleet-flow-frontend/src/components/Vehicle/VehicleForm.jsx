import { useState, useEffect } from "react";

const VEHICLE_TYPES = ["TRUCK", "VAN", "BIKE"];

export default function VehicleForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    nameModel: "",
    licensePlate: "",
    type: "TRUCK",
    maxCapacityKg: "",
    odometerKm: "",
    region: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nameModel: initialData.nameModel || "",
        licensePlate: initialData.licensePlate || "",
        type: initialData.type || "TRUCK",
        maxCapacityKg: initialData.maxCapacityKg || "",
        odometerKm: initialData.odometerKm || "",
        region: initialData.region || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let nextValue = value;
    if (name === "maxCapacityKg" || name === "odometerKm") {
      nextValue = value === "" ? "" : String(Math.max(0, Number(value)));
    }
    setFormData((prev) => ({ ...prev, [name]: nextValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const maxCapacityKg = Number(formData.maxCapacityKg);
    const odometerKm = Number(formData.odometerKm || 0);
    if (!Number.isFinite(maxCapacityKg) || maxCapacityKg < 0 || !Number.isFinite(odometerKm) || odometerKm < 0) {
      return;
    }
    onSubmit({
      ...formData,
      maxCapacityKg,
      odometerKm,
      isRetired: false,
    });
  };

  return (
    <form id="vehicle-form" onSubmit={handleSubmit} className="space-y-3" autoComplete="off">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Vehicle Name / Model</label>
          <input
            type="text"
            name="nameModel"
            value={formData.nameModel}
            onChange={handleChange}
            placeholder="e.g. Freightliner Cascadia"
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            autoComplete="off"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">License Plate</label>
          <input
            type="text"
            name="licensePlate"
            value={formData.licensePlate}
            onChange={handleChange}
            placeholder="ABC-1234"
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            autoComplete="off"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Vehicle Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none"
            autoComplete="off"
          >
            {VEHICLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Max Capacity (kg)</label>
          <input
            type="number"
            name="maxCapacityKg"
            value={formData.maxCapacityKg}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            required
            min="0"
            step="0.01"
            autoComplete="off"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Odometer (km)</label>
          <input
            type="number"
            name="odometerKm"
            value={formData.odometerKm}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            min="0"
            step="0.01"
            autoComplete="off"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1 ml-1">Region</label>
          <input
            type="text"
            name="region"
            value={formData.region}
            onChange={handleChange}
            placeholder="e.g. Northern Coast"
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            autoComplete="off"
          />
        </div>
      </div>
    </form>
  );
}
