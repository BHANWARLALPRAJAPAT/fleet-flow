import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { vehiclesApi } from '../api/vehiclesApi';

export default function VehicleCreatePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nameModel: '', licensePlate: '', type: 'TRUCK', region: '', maxCapacityKg: '', acquisitionCost: '', acquisitionDate: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);
    try {
      await vehiclesApi.create({ ...form, maxCapacityKg: Number(form.maxCapacityKg) || 0, acquisitionCost: form.acquisitionCost ? Number(form.acquisitionCost) : null, acquisitionDate: form.acquisitionDate || null });
      navigate('/app/vehicles');
    } catch (err) {
      if (err.response?.data?.fieldErrors) setErrors(err.response.data.fieldErrors);
      else setErrors({ _general: err.response?.data?.message || 'Failed to create vehicle' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell title="Add New Vehicle" description="Register a new vehicle into the fleet">
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          {errors._general && <p className="text-rose-600 text-sm">{errors._general}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Make & Model *</label>
              <input name="nameModel" value={form.nameModel} onChange={handleChange} className="w-full border-slate-300 rounded-lg shadow-sm p-2.5 border" required />
              {errors.nameModel && <p className="text-rose-500 text-xs mt-1">{errors.nameModel}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">License Plate *</label>
              <input name="licensePlate" value={form.licensePlate} onChange={handleChange} className="w-full border-slate-300 rounded-lg shadow-sm p-2.5 border" required />
              {errors.licensePlate && <p className="text-rose-500 text-xs mt-1">{errors.licensePlate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type *</label>
              <select name="type" value={form.type} onChange={handleChange} className="w-full border-slate-300 rounded-lg shadow-sm p-2.5 border text-slate-700">
                <option value="TRUCK">Truck</option><option value="VAN">Van</option><option value="BIKE">Bike</option><option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Max Capacity (kg) *</label>
              <input name="maxCapacityKg" type="number" value={form.maxCapacityKg} onChange={handleChange} className="w-full border-slate-300 rounded-lg shadow-sm p-2.5 border" required />
              {errors.maxCapacityKg && <p className="text-rose-500 text-xs mt-1">{errors.maxCapacityKg}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Region</label>
              <input name="region" value={form.region} onChange={handleChange} className="w-full border-slate-300 rounded-lg shadow-sm p-2.5 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Acquisition Date</label>
              <input name="acquisitionDate" type="date" value={form.acquisitionDate} onChange={handleChange} className="w-full border-slate-300 rounded-lg shadow-sm p-2.5 border text-slate-700" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => navigate('/app/vehicles')} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium disabled:opacity-50">
              {submitting ? 'Saving…' : 'Save Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}
