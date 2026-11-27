
import { Search } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  inputClassName = "",
  iconSize = 18,
}) {
  return (
    <div
      className={`relative flex min-w-48 flex-1 items-center ${className}`}
    >
      <Search
        size={iconSize}
        className="absolute left-3 text-gray-400"
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100 ${inputClassName}`}
      />
    </div>
  );
}
