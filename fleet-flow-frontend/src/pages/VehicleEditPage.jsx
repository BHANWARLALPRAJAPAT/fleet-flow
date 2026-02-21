import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { vehiclesApi } from '../api/vehiclesApi';

export default function VehicleEditPage() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    vehiclesApi.get(vehicleId).then(v => setForm({ nameModel: v.nameModel, licensePlate: v.licensePlate, type: v.type, region: v.region || '', maxCapacityKg: v.maxCapacityKg, acquisitionCost: v.acquisitionCost || '', acquisitionDate: v.acquisitionDate || '' })).catch(() => navigate('/app/vehicles'));
  }, [vehicleId, navigate]);

  if (!form) return <PageShell title="Loading…"><p className="p-6 text-slate-400">Loading…</p></PageShell>;

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);
    try {
      await vehiclesApi.update(vehicleId, { ...form, maxCapacityKg: Number(form.maxCapacityKg) || 0, acquisitionCost: form.acquisitionCost ? Number(form.acquisitionCost) : null, acquisitionDate: form.acquisitionDate || null });
      navigate('/app/vehicles');
    } catch (err) {
      if (err.response?.data?.fieldErrors) setErrors(err.response.data.fieldErrors);
      else setErrors({ _general: err.response?.data?.message || 'Failed to update' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell title={`Edit Vehicle #${vehicleId}`}>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          {errors._general && <p className="text-rose-600 text-sm">{errors._general}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Make & Model *</label>
              <input name="nameModel" value={form.nameModel} onChange={handleChange} className="w-full border-slate-300 rounded-lg shadow-sm p-2.5 border" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">License Plate *</label>
              <input name="licensePlate" value={form.licensePlate} onChange={handleChange} className="w-full border-slate-300 rounded-lg shadow-sm p-2.5 border" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select name="type" value={form.type} onChange={handleChange} className="w-full border-slate-300 rounded-lg shadow-sm p-2.5 border text-slate-700">
                <option value="TRUCK">Truck</option><option value="VAN">Van</option><option value="BIKE">Bike</option><option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Max Capacity (kg)</label>
              <input name="maxCapacityKg" type="number" value={form.maxCapacityKg} onChange={handleChange} className="w-full border-slate-300 rounded-lg shadow-sm p-2.5 border" required />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => navigate('/app/vehicles')} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium disabled:opacity-50">
              {submitting ? 'Updating…' : 'Update Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}
