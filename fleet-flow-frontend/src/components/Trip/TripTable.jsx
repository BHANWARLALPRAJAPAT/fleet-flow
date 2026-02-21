import { Edit, Trash2, Send, CheckCircle, XCircle, MapPin } from "lucide-react";
import DataTable from "../shared/DataTable";
import StatusPill from "../shared/StatusPill";

const STATUS_COLORS = {
  DRAFT: { bg: "bg-slate-100", text: "text-slate-600", label: "Draft" },
  DISPATCHED: { bg: "bg-blue-100", text: "text-blue-700", label: "Dispatched" },
  COMPLETED: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Completed" },
  CANCELLED: { bg: "bg-red-100", text: "text-red-700", label: "Cancelled" },
};

export default function TripTable({ trips, vehicles, drivers, onEdit, onDelete, onDispatch, onComplete, onCancel }) {
  const columns = [
    {
      key: "route",
      label: "Route",
      render: (_, row) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <MapPin size={12} className="text-slate-400" />
            <span>{row.origin}</span>
            <span className="text-slate-300">→</span>
            <span>{row.destination}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
            Weight: {row.cargoWeight != null ? Number(row.cargoWeight).toLocaleString() : "—"} kg
          </span>
        </div>
      ),
    },
    {
      key: "assignment",
      label: "Assignment",
      render: (_, row) => {
        const vehicle = vehicles.find(v => v.id === row.vehicleId);
        const driver = drivers.find(d => d.id === row.driverId);
        return (
          <div className="flex flex-col text-xs">
            <span className="font-semibold text-slate-700">🚛 {vehicle?.name || "Unknown"}</span>
            <span className="text-slate-400">👤 {driver?.fullName || "Unknown"}</span>
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (val) => <StatusPill status={val} colorMap={STATUS_COLORS} />,
    },
    {
      key: "createdAt",
      label: "Created",
      render: (val) => new Date(val).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => {
        const isDraft = row.status === "DRAFT";
        const isDispatched = row.status === "DISPATCHED";
        const isOver = row.status === "COMPLETED" || row.status === "CANCELLED";

        return (
          <div className="flex items-center gap-2">
            {isDraft && (
              <>
                <button
                  onClick={() => onDispatch(row)}
                  className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                  title="Dispatch Trip"
                >
                  <Send size={16} />
                </button>
                <button
                  onClick={() => onEdit(row)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
                  title="Edit"
                >
                  <Edit size={16} />
                </button>
              </>
            )}

            {isDispatched && (
              <button
                onClick={() => onComplete(row)}
                className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                title="Complete Trip"
              >
                <CheckCircle size={16} />
              </button>
            )}

            {!isOver && (
              <button
                onClick={() => onCancel(row)}
                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Cancel Trip"
              >
                <XCircle size={16} />
              </button>
            )}

            {isOver && (
              <span className="text-[10px] font-bold text-slate-300 uppercase italic">Locked</span>
            )}
            
            {isDraft && (
              <button
                 onClick={() => onDelete(row)}
                 className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                 title="Delete Draft"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={trips} emptyMessage="No trips planned yet." />;
}
