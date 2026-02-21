import { Edit, Trash2 } from "lucide-react";
import DataTable from "../shared/DataTable";
import StatusPill from "../shared/StatusPill";

const STATUS_COLORS = {
  AVAILABLE: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Available" },
  ON_TRIP: { bg: "bg-blue-100", text: "text-blue-700", label: "On Trip" },
  IN_SHOP: { bg: "bg-orange-100", text: "text-orange-700", label: "In Shop" },
  RETIRED: { bg: "bg-slate-100", text: "text-slate-700", label: "Retired" },
};

const TYPE_ICONS = {
  TRUCK: "🚛",
  VAN: "🚐",
  BIKE: "🏍️",
};

export default function VehicleTable({ vehicles, onEdit, onDelete }) {
  const columns = [
    {
      key: "name",
      label: "Name",
      render: (val, row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{val}</span>
          <span className="text-xs text-slate-400">{row.model}</span>
        </div>
      ),
    },
    { key: "licensePlate", label: "Plate" },
    {
      key: "type",
      label: "Type",
      render: (val) => (
        <div className="flex items-center gap-2">
          <span>{TYPE_ICONS[val] || "🚗"}</span>
          <span className="font-medium">{val}</span>
        </div>
      ),
    },
    { key: "capacity", label: "Capacity (kg)", render: (val) => val.toLocaleString() },
    { key: "odometer", label: "Odometer (km)", render: (val) => val.toLocaleString() },
    {
      key: "status",
      label: "Status",
      render: (val) => <StatusPill status={val} colorMap={STATUS_COLORS} />,
    },
    { key: "region", label: "Region" },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-3">
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

  return <DataTable columns={columns} data={vehicles} emptyMessage="No vehicles registered yet." />;
}
