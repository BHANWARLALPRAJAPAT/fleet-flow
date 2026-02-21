import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { expensesApi } from '../api/expensesApi';
import { vehiclesApi } from '../api/vehiclesApi';

export default function ExpenseCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ vehicleId: '', type: 'FUEL', amount: '', liters: '', description: '', odometerKm: '' });
  const [vehicles, setVehicles] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { vehiclesApi.list().then(setVehicles).catch(() => {}); }, []);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);
    try {
      await expensesApi.create({
        vehicleId: Number(form.vehicleId), type: form.type, amount: Number(form.amount),
        liters: form.liters ? Number(form.liters) : null,
        odometerKm: form.odometerKm ? Number(form.odometerKm) : null,
        description: form.description,
      });
      navigate('/app/expenses');
    } catch (err) {
      if (err.response?.data?.fieldErrors) setErrors(err.response.data.fieldErrors);
      else setErrors({ _general: err.response?.data?.message || 'Failed to create' });
    } finally { setSubmitting(false); }
  };

  return (
    <PageShell title="Add Expense" description="Record a new expense">
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          {errors._general && <p className="text-rose-600 text-sm">{errors._general}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle *</label>
              <select name="vehicleId" value={form.vehicleId} onChange={handleChange} className="w-full border-slate-300 rounded-lg shadow-sm p-2.5 border text-slate-700" required>
                <option value="">Select vehicle…</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.nameModel} ({v.licensePlate})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select name="type" value={form.type} onChange={handleChange} className="w-full border-slate-300 rounded-lg shadow-sm p-2.5 border text-slate-700">
                <option value="FUEL">Fuel</option><option value="MAINTENANCE">Maintenance</option><option value="TOLL">Toll</option>
                <option value="PARKING">Parking</option><option value="INSURANCE">Insurance</option><option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Amount ($) *</label>
              <input name="amount" type="number" step="0.01" value={form.amount} onChange={handleChange} className="w-full border-slate-300 rounded-lg shadow-sm p-2.5 border" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Liters (fuel only)</label>
              <input name="liters" type="number" step="0.01" value={form.liters} onChange={handleChange} className="w-full border-slate-300 rounded-lg shadow-sm p-2.5 border" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows="3" className="w-full border-slate-300 rounded-lg shadow-sm p-2.5 border resize-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => navigate('/app/expenses')} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium disabled:opacity-50">
              {submitting ? 'Saving…' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}
