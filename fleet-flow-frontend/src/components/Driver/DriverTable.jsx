import { Edit, Trash2, AlertCircle } from "lucide-react";
import DataTable from "../shared/DataTable";
import StatusPill from "../shared/StatusPill";

const STATUS_COLORS = {
  ON_DUTY: { bg: "bg-emerald-100", text: "text-emerald-700", label: "On Duty" },
  OFF_DUTY: { bg: "bg-slate-200", text: "text-slate-600", label: "Off Duty" },
  ON_TRIP: { bg: "bg-blue-100", text: "text-blue-700", label: "On Trip" },
  SUSPENDED: { bg: "bg-red-100", text: "text-red-700", label: "Suspended" },
};

const SafetyScoreBar = ({ score }) => {
  const getColor = (s) => {
    if (s >= 80) return "bg-emerald-500";
    if (s >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="flex items-center gap-3 min-w-[120px]">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${getColor(score)}`} 
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-bold text-slate-700 w-8">{score}</span>
    </div>
  );
};

const ExpiryWarning = ({ date }) => {
  const expiryDate = new Date(date);
  const now = new Date();
  const diffDays = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return <span className="text-red-500 font-bold flex items-center gap-1"><AlertCircle size={14}/> Expired</span>;
  if (diffDays <= 30) return <span className="text-red-400 font-medium flex items-center gap-1"><AlertCircle size={14}/> Due soon</span>;
  if (diffDays <= 60) return <span className="text-amber-500 font-medium">{date}</span>;
  
  return <span className="text-slate-600">{date}</span>;
};

export default function DriverTable({ drivers, onEdit, onDelete }) {
  const columns = [
    {
      key: "fullName",
      label: "Driver",
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs uppercase">
            {val.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-800">{val}</span>
            <span className="text-[10px] text-slate-400 tracking-wider font-semibold uppercase">{row.licenseCategory}</span>
          </div>
        </div>
      ),
    },
    { key: "licenseNumber", label: "License #" },
    {
      key: "licenseExpiry",
      label: "Expiry",
      render: (val) => <ExpiryWarning date={val} />,
    },
    {
      key: "status",
      label: "Status",
      render: (val) => <StatusPill status={val} colorMap={STATUS_COLORS} />,
    },
    {
      key: "safetyScore",
      label: "Safety Score",
      render: (val) => <SafetyScoreBar score={val} />,
    },
    { key: "tripsCompleted", label: "Trips", render: (val) => <span className="font-semibold text-slate-600">{val}</span> },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(row)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(row)}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={drivers} emptyMessage="No drivers registered yet." />;
}
