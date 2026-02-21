export default function StatusPill({ status, colorMap }) {
  const config = colorMap[status] || { bg: "bg-gray-100", text: "text-gray-600", label: status };

  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}
