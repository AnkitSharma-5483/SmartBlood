
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Package,
  ChartColumn,
  ShieldAlert,
  Activity,
  ClipboardList,
  Users,
  HandHeart,
  Send,
  Clock,
  FileBarChart,
  Droplet,
  X,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Forecast", href: "/forecasts", icon: ChartColumn },
  { name: "Risk Analysis", href: "/risk-alerts", icon: ShieldAlert },
  { name: "Explainability", href: "/explainability", icon: Activity },
  { name: "Requests", href: "/requests", icon: ClipboardList },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-64
          flex-col border-r bg-white p-5
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="mb-9 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplet className="h-8 w-8 fill-red-600 text-red-600" />

            <div>
              <h1 className="text-xl font-bold text-slate-800">
                SmartBlood
              </h1>
              <p className="text-xs text-gray-500">
                Hospital Management
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Main Menu
        </p>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 rounded-lg px-4 py-3
                  text-sm transition-colors
                  ${
                    isActive
                      ? "bg-red-50 font-semibold text-red-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }
                `}
              >
                <Icon size={19} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom information */}
        <div className="mt-5 rounded-xl bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">
            SmartBlood AI
          </p>

          <p className="mt-1 text-xs leading-relaxed text-gray-600">
            Explainable blood demand forecasting and
            inventory risk decision support.
          </p>
        </div>
      </aside>
    </>
  );
}
