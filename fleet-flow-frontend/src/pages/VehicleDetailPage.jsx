import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import StatusPill from '../components/StatusPill';
import { vehiclesApi } from '../api/vehiclesApi';

export default function VehicleDetailPage() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    vehiclesApi.get(vehicleId).then(setVehicle).catch(() => navigate('/app/vehicles')).finally(() => setLoading(false));
  }, [vehicleId, navigate]);

  if (loading) return <PageShell title="Loading…"><p className="p-6 text-slate-400">Loading vehicle…</p></PageShell>;
  if (!vehicle) return null;

  const actions = (
    <div className="flex gap-2">
      <button onClick={() => navigate('/app/vehicles')} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-medium border border-slate-200">Back</button>
      <button onClick={() => navigate(`/app/vehicles/${vehicleId}/edit`)} className="px-4 py-2 bg-slate-800 text-white hover:bg-slate-900 rounded-lg font-medium">Edit</button>
    </div>
  );

  return (
    <PageShell title={`Vehicle: ${vehicle.nameModel}`} actions={actions}>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl">🚛</div>
          <div>
            <h3 className="text-xl font-bold text-slate-800">{vehicle.nameModel}</h3>
            <p className="text-sm text-slate-500">License: {vehicle.licensePlate}</p>
          </div>
          <div className="ml-auto"><StatusPill status={vehicle.status} /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-700 border-b pb-2">Specifications</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <span className="text-slate-500">Type</span><span className="font-medium text-slate-800">{vehicle.type}</span>
              <span className="text-slate-500">Region</span><span className="font-medium text-slate-800">{vehicle.region || '—'}</span>
              <span className="text-slate-500">Max Capacity</span><span className="font-medium text-slate-800">{vehicle.maxCapacityKg} kg</span>
              <span className="text-slate-500">Odometer</span><span className="font-medium text-slate-800">{vehicle.odometerKm} km</span>
              <span className="text-slate-500">Acquisition Cost</span><span className="font-medium text-slate-800">{vehicle.acquisitionCost ? `$${vehicle.acquisitionCost}` : '—'}</span>
              <span className="text-slate-500">Acquisition Date</span><span className="font-medium text-slate-800">{vehicle.acquisitionDate || '—'}</span>
              <span className="text-slate-500">Retired</span><span className="font-medium text-slate-800">{vehicle.isRetired ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
