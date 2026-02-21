import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import StatusPill from '../components/StatusPill';
import { tripsApi } from '../api/tripsApi';

export default function TripDetailPage() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => tripsApi.get(tripId).then(setTrip).catch(() => navigate('/app/trips')).finally(() => setLoading(false));
  useEffect(() => { load(); }, [tripId]);

  const handleComplete = async () => {
    if (!window.confirm('Mark trip as completed?')) return;
    try { await tripsApi.complete(tripId); load(); } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };
  const handleCancel = async () => {
    if (!window.confirm('Cancel this trip?')) return;
    try { await tripsApi.cancel(tripId); load(); } catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  if (loading) return <PageShell title="Loading…"><p className="p-6 text-slate-400">Loading trip…</p></PageShell>;
  if (!trip) return null;

  const actions = (
    <div className="flex gap-2">
      <button onClick={() => navigate('/app/trips')} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-medium border border-slate-200">Back</button>
      {trip.status === 'DISPATCHED' && <button onClick={handleComplete} className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-medium">Complete</button>}
      {(trip.status === 'DRAFT' || trip.status === 'DISPATCHED') && <button onClick={handleCancel} className="px-4 py-2 bg-rose-600 text-white hover:bg-rose-700 rounded-lg font-medium">Cancel</button>}
    </div>
  );

  return (
    <PageShell title={`Trip #${trip.id}`} actions={actions}>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-800">{trip.origin} → {trip.destination}</h3>
            <p className="text-sm text-slate-500">Cargo: {trip.cargoWeightKg} kg</p>
          </div>
          <div className="ml-auto"><StatusPill status={trip.status} /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-700 border-b pb-2">Assignments</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <span className="text-slate-500">Vehicle</span><span className="font-medium text-slate-800">{trip.vehicleName || '—'}</span>
              <span className="text-slate-500">Driver</span><span className="font-medium text-slate-800">{trip.driverName || '—'}</span>
              <span className="text-slate-500">Revenue</span><span className="font-medium text-slate-800">{trip.revenue ? `$${trip.revenue}` : '—'}</span>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-700 border-b pb-2">Timeline</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <span className="text-slate-500">Created</span><span className="font-medium text-slate-800">{trip.createdAt ? new Date(trip.createdAt).toLocaleString() : '—'}</span>
              <span className="text-slate-500">Dispatched</span><span className="font-medium text-slate-800">{trip.dispatchedAt ? new Date(trip.dispatchedAt).toLocaleString() : '—'}</span>
              <span className="text-slate-500">Completed</span><span className="font-medium text-slate-800">{trip.completedAt ? new Date(trip.completedAt).toLocaleString() : '—'}</span>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
