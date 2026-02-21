import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { maintenanceApi } from '../api/maintenanceApi';

export default function MaintenanceListPage() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    maintenanceApi.list().then(setLogs).catch(err => setError(err.response?.data?.message || 'Failed to load')).finally(() => setLoading(false));
  }, []);

  const actions = (
    <button onClick={() => navigate('/app/maintenance/new')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
      + Log Maintenance
    </button>
  );

  return (
    <PageShell title="Maintenance Logs" description="Track vehicle maintenance" actions={actions}>
      {loading && <p className="p-6 text-slate-500">Loading…</p>}
      {error && <p className="p-6 text-rose-600">{error}</p>}
      {!loading && !error && logs.length === 0 && <p className="p-6 text-slate-400">No maintenance logs recorded.</p>}
      {!loading && logs.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-sm font-semibold text-slate-600">ID</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Vehicle</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Date</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Type</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Cost</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Description</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(l => (
                <tr key={l.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-800">{l.id}</td>
                  <td className="p-4 text-sm text-slate-600">{l.vehicleName}</td>
                  <td className="p-4 text-sm text-slate-600">{l.logDate}</td>
                  <td className="p-4 text-sm text-slate-600">{l.type}</td>
                  <td className="p-4 text-sm text-slate-600">${l.cost}</td>
                  <td className="p-4 text-sm text-slate-600">{l.description || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  );
}
