import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { expensesApi } from '../api/expensesApi';

export default function ExpensesListPage() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    expensesApi.list().then(setExpenses).catch(err => setError(err.response?.data?.message || 'Failed to load')).finally(() => setLoading(false));
  }, []);

  const actions = (
    <button onClick={() => navigate('/app/expenses/new')} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
      + Add Expense
    </button>
  );

  return (
    <PageShell title="Expenses" description="Track fleet expenses" actions={actions}>
      {loading && <p className="p-6 text-slate-500">Loading…</p>}
      {error && <p className="p-6 text-rose-600">{error}</p>}
      {!loading && !error && expenses.length === 0 && <p className="p-6 text-slate-400">No expenses recorded.</p>}
      {!loading && expenses.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-sm font-semibold text-slate-600">ID</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Vehicle</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Type</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Amount</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Date</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Description</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(e => (
                <tr key={e.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-800">{e.id}</td>
                  <td className="p-4 text-sm text-slate-600">{e.vehicleName}</td>
                  <td className="p-4 text-sm text-slate-600">{e.type}</td>
                  <td className="p-4 text-sm text-slate-600">${e.amount}</td>
                  <td className="p-4 text-sm text-slate-600">{e.expTs ? new Date(e.expTs).toLocaleDateString() : '—'}</td>
                  <td className="p-4 text-sm text-slate-600">{e.description || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  );
}
