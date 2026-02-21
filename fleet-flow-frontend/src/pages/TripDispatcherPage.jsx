import { useState, useEffect } from 'react';
import PageShell from '../components/PageShell';
import StatusPill from '../components/StatusPill';
import { tripsApi } from '../api/tripsApi';
import { vehiclesApi } from '../api/vehiclesApi';
import { driversApi } from '../api/driversApi';

export default function TripDispatcherPage() {
  const [draftTrips, setDraftTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [dispatchForm, setDispatchForm] = useState({ vehicleId: '', driverId: '' });

  const load = async () => {
    setLoading(true);
    try {
      const [trips, vehs, drvs] = await Promise.all([
        tripsApi.list({ status: 'DRAFT' }),
        vehiclesApi.list({ status: 'AVAILABLE' }),
        driversApi.list({ status: 'ON_DUTY' }),
      ]);
      setDraftTrips(trips);
      setVehicles(vehs);
      setDrivers(drvs);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDispatch = async () => {
    if (!selectedTrip || !dispatchForm.vehicleId || !dispatchForm.driverId) {
      alert('Select a trip, vehicle and driver');
      return;
    }
    try {
      await tripsApi.dispatch(selectedTrip, {
        vehicleId: Number(dispatchForm.vehicleId),
        driverId: Number(dispatchForm.driverId),
      });
      setSelectedTrip(null);
      setDispatchForm({ vehicleId: '', driverId: '' });
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Dispatch failed');
    }
  };

  return (
    <PageShell title="Trip Dispatcher" description="Dispatch draft trips to available vehicles and on-duty drivers">
      {loading ? <p className="p-6 text-slate-500">Loading…</p> : (
        <div className="p-6 space-y-8">
          {/* Draft trips */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Draft Trips ({draftTrips.length})</h3>
            {draftTrips.length === 0 ? <p className="text-slate-400">No draft trips to dispatch.</p> : (
              <div className="grid gap-3">
                {draftTrips.map(t => (
                  <div key={t.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedTrip === t.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}
                    onClick={() => setSelectedTrip(t.id)}>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-slate-800">{t.origin} → {t.destination}</span>
                        <span className="text-sm text-slate-500 ml-3">Cargo: {t.cargoWeightKg} kg</span>
                      </div>
                      <StatusPill status={t.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dispatch Form */}
          {selectedTrip && (
            <div className="border border-blue-200 rounded-lg p-6 bg-blue-50/50">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Dispatch Trip #{selectedTrip}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Assign Vehicle *</label>
                  <select value={dispatchForm.vehicleId} onChange={(e) => setDispatchForm(p => ({ ...p, vehicleId: e.target.value }))} className="w-full border-slate-300 rounded-lg shadow-sm p-2.5 border text-slate-700">
                    <option value="">Select vehicle…</option>
                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.nameModel} ({v.licensePlate}) — {v.maxCapacityKg} kg</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Assign Driver *</label>
                  <select value={dispatchForm.driverId} onChange={(e) => setDispatchForm(p => ({ ...p, driverId: e.target.value }))} className="w-full border-slate-300 rounded-lg shadow-sm p-2.5 border text-slate-700">
                    <option value="">Select driver…</option>
                    {drivers.map(d => <option key={d.id} value={d.id}>{d.fullName} — License: {d.licenseNo}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button onClick={handleDispatch} className="px-6 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-medium transition-colors">
                  Dispatch Trip
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
}
