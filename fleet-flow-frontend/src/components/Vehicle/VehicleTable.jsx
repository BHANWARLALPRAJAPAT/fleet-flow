import { Edit, Trash2 } from "lucide-react";
import DataTable from "../shared/DataTable";
import StatusPill from "../shared/StatusPill";

const STATUS_COLORS = {
  AVAILABLE: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Available" },
  ON_TRIP: { bg: "bg-blue-100", text: "text-blue-700", label: "On Trip" },
  IN_SHOP: { bg: "bg-orange-100", text: "text-orange-700", label: "In Shop" },
  OUT_OF_SERVICE: { bg: "bg-slate-100", text: "text-slate-700", label: "Out of Service" },
  RETIRED: { bg: "bg-red-100", text: "text-red-700", label: "Retired" },
};

const TYPE_ICONS = {
  TRUCK: "🚛",
  VAN: "🚐",
  BIKE: "🏍️",
  OTHER: "🚗",
};

export default function VehicleTable({ vehicles, onEdit, onDelete }) {
  const columns = [
    {
      key: "nameModel",
      label: "Name / Model",
      render: (val) => (
        <span className="font-bold text-slate-900">{val || "—"}</span>
      ),
    },
    { key: "licensePlate", label: "Plate" },
    {
      key: "type",
      label: "Type",
      render: (val) => (
        <div className="flex items-center gap-2">
          <span>{TYPE_ICONS[val] || "🚗"}</span>
          <span className="font-medium">{val || "—"}</span>
        </div>
      ),
    },
    { key: "maxCapacityKg", label: "Capacity (kg)", render: (val) => val != null ? Number(val).toLocaleString() : "—" },
    { key: "odometerKm", label: "Odometer (km)", render: (val) => val != null ? Number(val).toLocaleString() : "—" },
    {
      key: "status",
      label: "Status",
      render: (val) => <StatusPill status={val} colorMap={STATUS_COLORS} />,
    },
    { key: "region", label: "Region", render: (val) => val || "—" },
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
            title="Retire"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={vehicles} emptyMessage="No vehicles registered yet." />;
}
