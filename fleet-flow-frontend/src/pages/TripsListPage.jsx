import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import StatusPill from '../components/StatusPill';
import { tripsApi } from '../api/tripsApi';

export default function TripsListPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    tripsApi.list().then(setTrips).catch(err => setError(err.response?.data?.message || 'Failed to load trips')).finally(() => setLoading(false));
  }, []);

  const actions = (
    <button onClick={() => navigate('/app/trips/new')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
      + Create Trip
    </button>
  );

  return (
    <PageShell title="Trip Management" description="View and manage all trips" actions={actions}>
      {loading && <p className="p-6 text-slate-500">Loading…</p>}
      {error && <p className="p-6 text-rose-600">{error}</p>}
      {!loading && !error && trips.length === 0 && <p className="p-6 text-slate-400">No trips found.</p>}
      {!loading && trips.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-sm font-semibold text-slate-600">ID</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Vehicle</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Driver</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Route</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="p-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {trips.map(t => (
                <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-800">{t.id}</td>
                  <td className="p-4 text-sm text-slate-600">{t.vehicleName || '—'}</td>
                  <td className="p-4 text-sm text-slate-600">{t.driverName || '—'}</td>
                  <td className="p-4 text-sm text-slate-600">{t.origin} → {t.destination}</td>
                  <td className="p-4"><StatusPill status={t.status} /></td>
                  <td className="p-4 flex justify-end gap-2">
                    <button onClick={() => navigate(`/app/trips/${t.id}`)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">View</button>
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
