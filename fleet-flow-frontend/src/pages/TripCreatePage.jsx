import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { tripsApi } from '../api/tripsApi';
import { vehiclesApi } from '../api/vehiclesApi';
import { driversApi } from '../api/driversApi';

export default function TripCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ origin: '', destination: '', cargoWeightKg: '', vehicleId: '', driverId: '' });
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    vehiclesApi.list({ status: 'AVAILABLE' }).then(setVehicles).catch(() => {});
    driversApi.list({ status: 'ON_DUTY' }).then(setDrivers).catch(() => {});
  }, []);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);
    try {
      await tripsApi.create({ ...form, cargoWeightKg: Number(form.cargoWeightKg) || 0, vehicleId: form.vehicleId ? Number(form.vehicleId) : null, driverId: form.driverId ? Number(form.driverId) : null });
      navigate('/app/trips');
    } catch (err) {
      if (err.response?.data?.fieldErrors) setErrors(err.response.data.fieldErrors);
      else setErrors({ _general: err.response?.data?.message || 'Failed to create trip' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell title="Create New Trip" description="Create a trip draft">
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          {errors._general && <p className="text-rose-600 text-sm">{errors._general}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Origin *</label>
              <input name="origin" value={form.origin} onChange={handleChange} className="w-full border-slate-300 rounded-lg shadow-sm p-2.5 border" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Destination *</label>
              <input name="destination" value={form.destination} onChange={handleChange} className="w-full border-slate-300 rounded-lg shadow-sm p-2.5 border" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cargo Weight (kg) *</label>
              <input name="cargoWeightKg" type="number" value={form.cargoWeightKg} onChange={handleChange} className="w-full border-slate-300 rounded-lg shadow-sm p-2.5 border" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle (optional)</label>
              <select name="vehicleId" value={form.vehicleId} onChange={handleChange} className="w-full border-slate-300 rounded-lg shadow-sm p-2.5 border text-slate-700">
                <option value="">None</option>
                {vehicles.map(v => <option key={v.id} value={v.id}>{v.nameModel} ({v.licensePlate})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Driver (optional)</label>
              <select name="driverId" value={form.driverId} onChange={handleChange} className="w-full border-slate-300 rounded-lg shadow-sm p-2.5 border text-slate-700">
                <option value="">None</option>
                {drivers.map(d => <option key={d.id} value={d.id}>{d.fullName}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => navigate('/app/trips')} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium disabled:opacity-50">
              {submitting ? 'Saving…' : 'Save Trip Draft'}
            </button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}
