import React from 'react';

const getStatusColor = (status) => {
  const norm = (status || '').toLowerCase();
  switch(norm) {
    case 'available':
    case 'active':
    case 'completed':
    case 'healthy':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'on trip':
    case 'in transit':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'in shop':
    case 'maintenance':
    case 'pending':
    case 'scheduled':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'out of service':
    case 'delayed':
    case 'critical':
      return 'bg-rose-100 text-rose-800 border-rose-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

export default function StatusPill({ status }) {
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(status)} inline-flex items-center justify-center whitespace-nowrap`}>
      {status}
    </span>
  );
}
