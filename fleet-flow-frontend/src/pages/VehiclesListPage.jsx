import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import StatusPill from '../components/StatusPill';
import { vehiclesApi } from '../api/vehiclesApi';

export default function VehiclesListPage() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    vehiclesApi.list()
      .then(setVehicles)
      .catch(err => setError(err.response?.data?.message || 'Failed to load vehicles'))
      .finally(() => setLoading(false));
  }, []);

  const handleRetire = async (id) => {
    if (!window.confirm('Retire this vehicle? This sets it OUT_OF_SERVICE.')) return;
    try {
      const updated = await vehiclesApi.retire(id);
      setVehicles(prev => prev.map(v => v.id === id ? updated : v));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to retire vehicle');
    }
  };

  const actions = (
    <button onClick={() => navigate('/app/vehicles/new')}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
      + Add Vehicle
    </button>
  );

  return (
    <PageShell title="Vehicle Registry" description="Manage your fleet vehicles" actions={actions}>
      {loading && <p className="p-6 text-slate-500">Loading…</p>}
      {error && <p className="p-6 text-rose-600">{error}</p>}
      {!loading && !error && vehicles.length === 0 && (
        <p className="p-6 text-slate-400">No vehicles registered yet. Click "+ Add Vehicle" to start.</p>
      )}
      {!loading && vehicles.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-sm font-semibold text-slate-600">ID</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Make & Model</th>
                <th className="p-4 text-sm font-semibold text-slate-600">License Plate</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Type</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="p-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map(v => (
                <tr key={v.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-800">{v.id}</td>
                  <td className="p-4 text-sm text-slate-600">{v.nameModel}</td>
                  <td className="p-4 text-sm text-slate-600">{v.licensePlate}</td>
                  <td className="p-4 text-sm text-slate-600">{v.type}</td>
                  <td className="p-4"><StatusPill status={v.status} /></td>
                  <td className="p-4 flex justify-end gap-2">
                    <button onClick={() => navigate(`/app/vehicles/${v.id}`)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>
                    <button onClick={() => navigate(`/app/vehicles/${v.id}/edit`)} className="text-slate-600 hover:text-slate-800 text-sm font-medium">Edit</button>
                    {!v.isRetired && <button onClick={() => handleRetire(v.id)} className="text-rose-600 hover:text-rose-800 text-sm font-medium">Retire</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  );
}
