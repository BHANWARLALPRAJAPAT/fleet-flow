import DataTable from "../shared/DataTable";
import StatusPill from "../shared/StatusPill";

const TYPE_COLORS = {
  FUEL: { bg: "bg-blue-100", text: "text-blue-700", label: "Fuel" },
  MAINTENANCE: { bg: "bg-orange-100", text: "text-orange-700", label: "Maintenance" },
  TOLL: { bg: "bg-purple-100", text: "text-purple-700", label: "Toll" },
  PARKING: { bg: "bg-indigo-100", text: "text-indigo-700", label: "Parking" },
  INSURANCE: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Insurance" },
  OTHER: { bg: "bg-slate-100", text: "text-slate-700", label: "Other" },
};

export default function ExpenseTable({ expenses, vehicles }) {
  const extractIdFromHref = (href) => {
    if (!href) return null;
    const parts = href.split("/");
    return parts[parts.length - 1];
  };

  const getVehicleName = (exp) => {
    if (exp.vehicleName) return exp.vehicleName;
    const vid = exp.vehicleId || exp.vehicle?.id || extractIdFromHref(exp._links?.vehicle?.href);
    if (vid) {
      const v = vehicles.find(v => String(v.id) === String(vid));
      if (v) return v.nameModel;
    }
    return "Unknown";
  };

  const columns = [
    {
      key: "type",
      label: "Type",
      render: (val) => <StatusPill status={val} colorMap={TYPE_COLORS} />,
    },
    {
      key: "vehicle",
      label: "Vehicle",
      render: (_, row) => (
        <span className="font-bold text-slate-900">{getVehicleName(row)}</span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (val) => (
        <span className="font-semibold text-slate-700">
          ${val != null ? Number(val).toLocaleString(undefined, { minimumFractionDigits: 2 }) : "0.00"}
        </span>
      ),
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
      key: "expTs",
      label: "Date",
      render: (val) => val ? new Date(val).toLocaleDateString() : "—",
    },
  ];

  return <DataTable columns={columns} data={expenses} emptyMessage="No expenses recorded yet." />;
}
