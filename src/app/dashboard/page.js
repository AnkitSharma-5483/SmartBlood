
"use client";

import {
  LayoutDashboard,
  Droplet,
  TrendingUp,
  AlertTriangle,
  Package,
  Activity,
  CalendarDays,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Search,
  Bell,
  Menu,
  ShieldAlert,
  ChartColumn,
  RefreshCw,
} from "lucide-react";

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

const inventory = [
  { group: "A+", stock: 320, status: "Healthy" },
  { group: "A-", stock: 85, status: "Healthy" },
  { group: "B+", stock: 280, status: "Healthy" },
  { group: "B-", stock: 42, status: "Low Stock" },
  { group: "AB+", stock: 35, status: "Critical" },
  { group: "AB-", stock: 68, status: "Healthy" },
  { group: "O+", stock: 410, status: "Healthy" },
  { group: "O-", stock: 25, status: "Critical" },
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
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r bg-white p-5 lg:block">
        <div className="mb-10 flex items-center gap-2">
          <Droplet className="h-8 w-8 fill-red-600 text-red-600" />
          <div>
            <h1 className="text-xl font-bold">SmartBlood</h1>
            <p className="text-xs text-gray-500">Hospital Management</p>
          </div>
        </div>

        <p className="mb-3 text-xs font-semibold uppercase text-gray-400">
          Main Menu
        </p>

        <nav className="space-y-2">
          {[
            [LayoutDashboard, "Dashboard"],
            [Package, "Inventory"],
            [ChartColumn, "Demand Forecast"],
            [ShieldAlert, "Risk Analysis"],
            [Activity, "Explainability"],
          ].map(([Icon, label], index) => (
            <div
              key={label}
              className={`flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-sm ${
                index === 0
                  ? "bg-red-50 font-semibold text-red-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon size={19} />
              {label}
            </div>
          ))}
        </nav>

        <div className="absolute bottom-6 left-5 right-5 rounded-xl bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">
            SmartBlood AI
          </p>
          <p className="mt-1 text-xs text-gray-600">
            Explainable blood demand forecasting and inventory risk support.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64">

        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4 md:px-8">
          <div>
            <h2 className="text-xl font-bold">Dashboard Overview</h2>
            <p className="text-sm text-gray-500">
              Blood bank management and analytics
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="rounded-lg border p-2">
              <Bell size={19} />
            </button>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">Hospital Admin</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 font-bold text-red-600">
              HA
            </div>
          </div>
        </header>

        <div className="space-y-7 p-5 md:p-8">

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

            <button className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700">
              <Plus size={17} />
              Add Blood Units
            </button>
          </section>

          {/* Statistics */}
          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-xl border bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className={`rounded-lg p-3 ${item.bg}`}>
                      <Icon className={item.color} size={22} />
                    </div>
                    <span className="text-xs text-gray-500">
                      {item.change}
                    </span>
                  </div>

                  <p className="mt-5 text-sm text-gray-500">
                    {item.title}
                  </p>
                  <h3 className="mt-1 text-3xl font-bold">
                    {item.value}
                  </h3>
                </div>
              );
            })}
          </section>

          {/* Analytics */}
          <section className="grid gap-5 xl:grid-cols-3">

            {/* Demand Chart */}
            <div className="rounded-xl border bg-white p-5 shadow-sm xl:col-span-2">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="font-bold">Blood Demand Trends</h3>
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

            {/* Risk Summary */}
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <h3 className="font-bold">Inventory Risk Summary</h3>
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
                  <span className="text-sm text-gray-600">{title}</span>
                  <span className={`text-sm font-bold ${color}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Inventory and Alerts */}
          <section className="grid gap-5 xl:grid-cols-3">

            {/* Inventory Table */}
            <div className="overflow-hidden rounded-xl border bg-white shadow-sm xl:col-span-2">
              <div className="flex items-center justify-between p-5">
                <div>
                  <h3 className="font-bold">Blood Inventory</h3>
                  <p className="text-sm text-gray-500">
                    Current stock by blood group
                  </p>
                </div>
                <button className="text-sm font-medium text-red-600">
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-5 py-3">Blood Group</th>
                      <th className="px-5 py-3">Available Units</th>
                      <th className="px-5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => (
                      <tr key={item.group} className="border-t">
                        <td className="px-5 py-4 font-semibold">
                          {item.group}
                        </td>
                        <td className="px-5 py-4">{item.stock}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                              item.status === "Healthy"
                                ? "bg-green-50 text-green-700"
                                : item.status === "Low Stock"
                                ? "bg-orange-50 text-orange-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Alerts */}
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold">Critical Alerts</h3>
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
      </main>
    </div>
  );
}
