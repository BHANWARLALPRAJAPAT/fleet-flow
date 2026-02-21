import { useState } from "react";

const EXPENSE_TYPES = ["FUEL", "MAINTENANCE", "TOLL", "PARKING", "INSURANCE", "OTHER"];

export default function ExpenseForm({ vehicles, onSubmit }) {
  const [formData, setFormData] = useState({
    vehicleId: "",
    type: "FUEL",
    amount: "",
    liters: "",
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
      type: formData.type,
      amount: Number(formData.amount),
      liters: formData.liters ? Number(formData.liters) : null,
      odometerKm: formData.odometerKm ? Number(formData.odometerKm) : null,
      description: formData.description,
    });
  };

  return (
    <form id="expense-form" onSubmit={handleSubmit} className="space-y-4">
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
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Expense Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none"
          >
            {EXPENSE_TYPES.map((t) => (
              <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Amount ($) *</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0.01"
            placeholder="0.00"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            required
          />
        </div>

        {formData.type === "FUEL" && (
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Liters</label>
            <input
              type="number"
              name="liters"
              value={formData.liters}
              onChange={handleChange}
              step="0.1"
              placeholder="Optional"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all"
            />
          </div>
        )}

        <div className="col-span-2">
          <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5 ml-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="2"
            placeholder="Expense details..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none"
          />
        </div>
      </div>
    </form>
  );
}
