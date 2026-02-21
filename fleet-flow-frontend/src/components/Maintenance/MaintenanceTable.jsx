import DataTable from "../shared/DataTable";
import StatusPill from "../shared/StatusPill";

const TYPE_COLORS = {
  PREVENTIVE: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Preventive" },
  REACTIVE: { bg: "bg-red-100", text: "text-red-700", label: "Reactive" },
  INSPECTION: { bg: "bg-blue-100", text: "text-blue-700", label: "Inspection" },
  OTHER: { bg: "bg-slate-100", text: "text-slate-700", label: "Other" },
};

export default function MaintenanceTable({ logs, vehicles, onEdit, onDelete }) {
  const getVehicleName = (log) => {
    if (log.vehicleName) return log.vehicleName;
    // HATEOAS: vehicle is a link, not an inline object
    const vid = log.vehicleId || log.vehicle?.id || extractIdFromHref(log._links?.vehicle?.href);
    if (vid) {
      const v = vehicles.find(v => String(v.id) === String(vid));
      if (v) return v.nameModel;
    }
    return "Unknown";
  };

  const extractIdFromHref = (href) => {
    if (!href) return null;
    const parts = href.split("/");
    return parts[parts.length - 1];
  };

  const columns = [
    {
      key: "vehicle",
      label: "Vehicle",
      render: (_, row) => (
        <span className="font-bold text-slate-900">{getVehicleName(row)}</span>
      ),
    },
    {
      key: "type",
      label: "Service Type",
      render: (val) => <StatusPill status={val} colorMap={TYPE_COLORS} />,
    },
    {
      key: "description",
      label: "Description",
      render: (val) => (
        <span className="text-slate-600 text-xs" title={val}>
          {val ? (val.length > 50 ? val.substring(0, 50) + "…" : val) : "—"}
        </span>
      ),
    },
    {
      key: "cost",
      label: "Cost",
      render: (val) => (
        <span className="font-semibold text-slate-700">
          ${val != null ? Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 }) : "0.00"}
        </span>
      ),
    },
    {
      key: "logDate",
      label: "Service Date",
      render: (val) => val ? new Date(val).toLocaleDateString() : "—",
    },
  ];

  return <DataTable columns={columns} data={logs} emptyMessage="No maintenance logs recorded yet." />;
}
