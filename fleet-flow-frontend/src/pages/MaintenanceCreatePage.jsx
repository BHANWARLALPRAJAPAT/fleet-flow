import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { maintenanceApi } from '../api/maintenanceApi';
import { vehiclesApi } from '../api/vehiclesApi';

export default function MaintenanceCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ vehicleId: '', logDate: '', type: 'PREVENTIVE', description: '', cost: '' });
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
      await maintenanceApi.create({ vehicleId: Number(form.vehicleId), logDate: form.logDate || null, type: form.type, description: form.description, cost: Number(form.cost) || 0 });
      navigate('/app/maintenance');
    } catch (err) {
      if (err.response?.data?.fieldErrors) setErrors(err.response.data.fieldErrors);
      else setErrors({ _general: err.response?.data?.message || 'Failed to create' });
    } finally { setSubmitting(false); }
  };

  return (
    <PageShell title="Log Maintenance" description="Record a new maintenance entry">
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
                <option value="PREVENTIVE">Preventive</option><option value="REACTIVE">Reactive</option><option value="INSPECTION">Inspection</option><option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input name="logDate" type="date" value={form.logDate} onChange={handleChange} className="w-full border-slate-300 rounded-lg shadow-sm p-2.5 border text-slate-700" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cost ($)</label>
              <input name="cost" type="number" value={form.cost} onChange={handleChange} className="w-full border-slate-300 rounded-lg shadow-sm p-2.5 border" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows="3" className="w-full border-slate-300 rounded-lg shadow-sm p-2.5 border resize-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => navigate('/app/maintenance')} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium disabled:opacity-50">
              {submitting ? 'Saving…' : 'Save Log'}
            </button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}
