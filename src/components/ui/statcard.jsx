
export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
  color,
  bg,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">
        <div className={`rounded-lg p-3 ${bg}`}>
          {Icon && <Icon className={color} size={22} />}
        </div>

        {change && (
          <span className="text-xs text-gray-500">
            {change}
          </span>
        )}
      </div>

      <p className="mt-5 text-sm text-gray-500">
        {title}
      </p>

      <h3 className="mt-1 text-3xl font-bold">
        {value}
      </h3>

    </div>
  );
}
