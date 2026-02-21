import { useState, useEffect } from 'react';
import PageShell from '../components/PageShell';
import { performanceApi } from '../api/dashboardApi';

export default function PerformancePage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    performanceApi.getSummary().then(setSummary).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <PageShell title="Performance" description="Fleet and driver performance metrics">
      <div className="p-6">
        {loading ? <p className="text-slate-500">Loading…</p> : summary ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500">Fleet Utilization</p>
              <p className="text-3xl font-bold text-slate-800 mt-2">{summary.fleetUtilization}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500">On-Time Delivery Rate</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">{summary.onTimeDeliveryRate}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500">Total Trips</p>
              <p className="text-3xl font-bold text-slate-800 mt-2">{summary.totalTrips}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500">Completed Trips</p>
              <p className="text-3xl font-bold text-emerald-600 mt-2">{summary.completedTrips}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500">Cancelled Trips</p>
              <p className="text-3xl font-bold text-rose-600 mt-2">{summary.cancelledTrips}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-6">
              <p className="text-sm text-slate-500">Active Drivers</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{summary.activeDrivers}</p>
            </div>
          </div>
        ) : <p className="text-slate-400">Unable to load performance data.</p>}
      </div>
    </PageShell>
  );
}
