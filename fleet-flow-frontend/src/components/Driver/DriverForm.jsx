import { useState, useEffect } from "react";

const CATEGORIES = ["TRUCK", "VAN", "BIKE"];
const STATUSES = ["ON_DUTY", "OFF_DUTY", "ON_TRIP", "SUSPENDED"];

export default function DriverForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    fullName: "",
    licenseNumber: "",
    licenseExpiry: "",
    licenseCategory: "TRUCK",
    status: "ON_DUTY",
    safetyScore: 100,
    tripsCompleted: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === "safetyScore" || name === "tripsCompleted" ? Number(value) : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form id="driver-form" onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="e.g. Michael Scott"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            required
          />
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">License Number</label>
          <input
            type="text"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            placeholder="DL-12345678"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">License Expiry</label>
          <input
            type="date"
            name="licenseExpiry"
            value={formData.licenseExpiry}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">License Category</label>
          <select
            name="licenseCategory"
            value={formData.licenseCategory}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none"
          >
            {CATEGORIES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Initial Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none"
          >
            {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Safety Score (0-100)</label>
          <input
            type="number"
            name="safetyScore"
            value={formData.safetyScore}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            required
            min="0"
            max="100"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Trips Completed</label>
          <input
            type="number"
            name="tripsCompleted"
            value={formData.tripsCompleted}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            required
            min="0"
          />
        </div>
      </div>
    </form>
  );
}
