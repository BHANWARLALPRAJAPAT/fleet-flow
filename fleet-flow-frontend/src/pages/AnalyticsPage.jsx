import { useState, useEffect } from 'react';
import PageShell from '../components/PageShell';
import { performanceApi } from '../api/dashboardApi';

export default function AnalyticsPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    performanceApi.getSummary().then(setSummary).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <PageShell title="Analytics" description="Fleet analytics and insights">
      <div className="p-6">
        {loading ? <p className="text-slate-500">Loading analytics…</p> : summary ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-700 mb-4">Trip Completion</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Completed</span><span className="font-medium text-emerald-600">{summary.completedTrips}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Cancelled</span><span className="font-medium text-rose-600">{summary.cancelledTrips}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Total</span><span className="font-medium text-slate-800">{summary.totalTrips}</span></div>
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-700 mb-4">Fleet Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Fleet Utilization</span><span className="font-medium text-blue-600">{summary.fleetUtilization}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">On-Time Rate</span><span className="font-medium text-emerald-600">{summary.onTimeDeliveryRate}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Active Drivers</span><span className="font-medium text-slate-800">{summary.activeDrivers}</span></div>
                </div>
              </div>
            </div>
          </div>
        ) : <p className="text-slate-400">Unable to load analytics.</p>}
      </div>
    </PageShell>
  );
}
