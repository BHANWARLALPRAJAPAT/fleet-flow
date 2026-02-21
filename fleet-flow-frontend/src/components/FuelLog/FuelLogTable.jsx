import DataTable from "../shared/DataTable";

export default function FuelLogTable({ logs, vehicles }) {
  const extractIdFromHref = (href) => {
    if (!href) return null;
    const parts = href.split("/");
    return parts[parts.length - 1];
  };

  const getVehicleName = (log) => {
    if (log.vehicleName) return log.vehicleName;
    const vid = log.vehicleId || log.vehicle?.id || extractIdFromHref(log._links?.vehicle?.href);
    if (vid) {
      const v = vehicles.find(v => String(v.id) === String(vid));
      if (v) return v.nameModel;
    }
    return "Unknown";
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
      key: "liters",
      label: "Liters",
      render: (val) => (
        <span className="font-semibold text-blue-600">
          {val != null ? Number(val).toLocaleString(undefined, { minimumFractionDigits: 1 }) + " L" : "—"}
        </span>
      ),
    },
    {
      key: "amount",
      label: "Cost",
      render: (val) => (
        <span className="font-semibold text-slate-700">
          ${val != null ? Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 }) : "0.00"}
        </span>
      ),
    },
    {
      key: "odometerKm",
      label: "Odometer (km)",
      render: (val) => val != null ? Number(val).toLocaleString() : "—",
    },
    {
      key: "expTs",
      label: "Date",
      render: (val) => val ? new Date(val).toLocaleDateString() : "—",
    },
    {
      key: "description",
      label: "Notes",
      render: (val) => (
        <span className="text-slate-600 text-xs" title={val}>
          {val ? (val.length > 40 ? val.substring(0, 40) + "…" : val) : "—"}
        </span>
      ),
    },
  ];

  return <DataTable columns={columns} data={logs} emptyMessage="No fuel logs recorded yet." />;
}
