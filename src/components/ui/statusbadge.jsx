
const badgeStyles = {
  Positive: "bg-red-50 text-red-600 border-red-200",
  Negative: "bg-green-50 text-green-600 border-green-200",
  Variable: "bg-blue-50 text-blue-600 border-blue-200",

  Healthy: "bg-green-50 text-green-700 border-green-200",
  "Low Stock": "bg-orange-50 text-orange-700 border-orange-200",

  Critical: "bg-red-100 text-red-700 border-red-200",
  High: "bg-orange-100 text-orange-700 border-orange-200",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Low: "bg-green-100 text-green-700 border-green-200",

  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Approved: "bg-blue-50 text-blue-700 border-blue-200",
  Issued: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",

  Emergency: "bg-red-50 text-red-700 border-red-200",
  Normal: "bg-slate-100 text-slate-600 border-slate-200",
  "Excess Stock": "bg-orange-50 text-orange-700 border-orange-200",
  Expiry: "bg-purple-50 text-purple-700 border-purple-200",
  Shortage: "bg-red-50 text-red-700 border-red-200",
};

const confidenceStyles = {
  High: "bg-green-50 text-green-700 border-green-200",
  Medium: "bg-orange-50 text-orange-700 border-orange-200",
  Low: "bg-red-50 text-red-700 border-red-200",
};

export default function StatusBadge({
  status,
  variant = "default",
  className = "",
}) {
  const styles =
    variant === "confidence" ? confidenceStyles : badgeStyles;

  const style =
    styles[status] ||
    "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${style} ${className}`}
    >
      {status}
    </span>
  );
}
