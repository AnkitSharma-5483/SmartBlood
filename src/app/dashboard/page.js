"use client";

import {
  Droplet,
  TrendingUp,
  AlertTriangle,
  Clock,
  CalendarDays,
  Plus,
} from "lucide-react";

import StatCard from "@/components/ui/statcard";

const stats = [
  {
    title: "Total Blood Units",
    value: "2,450",
    change: "+12.5%",
    icon: Droplet,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    title: "Predicted Demand",
    value: "384",
    change: "Next 7 days",
    icon: TrendingUp,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    title: "Critical Shortages",
    value: "03",
    change: "Needs attention",
    icon: AlertTriangle,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    title: "Near Expiry Units",
    value: "28",
    change: "Within 7 days",
    icon: Clock,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

const alerts = [
  {
    title: "Critical O- Blood Shortage",
    description: "Current stock is below safety stock level.",
    time: "10 minutes ago",
    type: "critical",
  },
  {
    title: "AB+ Stock Running Low",
    description: "Predicted demand exceeds available inventory.",
    time: "35 minutes ago",
    type: "warning",
  },
  {
    title: "Expiry Risk Detected",
    description: "12 units are approaching their expiry date.",
    time: "1 hour ago",
    type: "warning",
  },
];

const demand = [
  { day: "Mon", value: 45 },
  { day: "Tue", value: 65 },
  { day: "Wed", value: 55 },
  { day: "Thu", value: 80 },
  { day: "Fri", value: 60 },
  { day: "Sat", value: 90 },
  { day: "Sun", value: 70 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-7">

      {/* Welcome */}
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">
            Welcome back, Admin
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Here's what's happening with your blood inventory.
          </p>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard
            key={item.title}
            title={item.title}
            value={item.value}
            change={item.change}
            icon={item.icon}
            color={item.color}
            bg={item.bg}
          />
        ))}
      </section>

      {/* Analytics */}
      <section className="grid gap-5">

        {/* Demand Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-bold">
                Blood Demand Trends
              </h3>

              <p className="text-sm text-gray-500">
                Weekly blood demand overview
              </p>
            </div>

            <CalendarDays className="text-gray-400" />
          </div>

          <div className="flex h-56 items-end justify-around gap-3 border-b border-l px-3">
            {demand.map((item) => (
              <div
                key={item.day}
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <div className="text-xs text-gray-500">
                  {item.value}
                </div>

                <div
                  className="w-full max-w-12 rounded-t-md bg-red-500 hover:bg-red-600"
                  style={{ height: `${item.value}%` }}
                />

                <span className="text-xs text-gray-500">
                  {item.day}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            Blood units demanded
          </div>
        </div>

      </section>

      {/* Risk Summary and Alerts */}
      <section className="grid gap-5 xl:grid-cols-2">

        {/* Risk Summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <h3 className="font-bold">
            Inventory Risk Summary
          </h3>

          <p className="mb-5 mt-1 text-sm text-gray-500">
            Current inventory risk assessment
          </p>

          {[
            ["Shortage Risk", "03 Groups", "text-red-600"],
            ["Excess Stock Risk", "02 Groups", "text-orange-600"],
            ["Expiry Risk", "28 Units", "text-purple-600"],
          ].map(([title, value, color]) => (
            <div
              key={title}
              className="mb-4 flex items-center justify-between rounded-lg bg-gray-50 p-4"
            >
              <span className="text-sm text-gray-600">
                {title}
              </span>

              <span className={`text-sm font-bold ${color}`}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Alerts */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="font-bold">
                Critical Alerts
              </h3>

              <p className="text-sm text-gray-500">
                Important notifications
              </p>
            </div>

            <AlertTriangle className="text-red-500" />
          </div>

          <div className="space-y-5">
            {alerts.map((alert) => (
              <div key={alert.title} className="flex gap-3">

                <div
                  className={`mt-1 h-9 w-9 shrink-0 rounded-lg p-2 ${
                    alert.type === "critical"
                      ? "bg-red-50 text-red-600"
                      : "bg-orange-50 text-orange-600"
                  }`}
                >
                  <AlertTriangle size={20} />
                </div>

                <div>
                  <h4 className="text-sm font-semibold">
                    {alert.title}
                  </h4>

                  <p className="mt-1 text-xs text-gray-500">
                    {alert.description}
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    {alert.time}
                  </p>
                </div>

              </div>
            ))}
          </div>
        </div>

      </section>

      {/* Footer */}
      <footer className="flex flex-wrap justify-between gap-2 border-t pt-5 text-xs text-gray-400">
        <p>SmartBlood - Blood Bank Intelligence System</p>
        <p>ML-powered decision support</p>
      </footer>

    </div>
  );
}
