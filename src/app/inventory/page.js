"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Droplet,
  Package,
  AlertTriangle,
  Clock,
  Search,
  Plus,
  X,
} from "lucide-react";

import StatCard from "@/components/ui/statcard";

const initialInventory = [
  { id: 1, group: "A+", component: "RBC", units: 120, expiry: "2026-12-05" },
  { id: 2, group: "A-", component: "RBC", units: 45, expiry: "2026-12-02" },
  { id: 3, group: "B+", component: "RBC", units: 95, expiry: "2026-12-10" },
  { id: 4, group: "B-", component: "RBC", units: 22, expiry: "2026-11-29" },
  { id: 5, group: "AB+", component: "RBC", units: 18, expiry: "2026-11-28" },
  { id: 6, group: "AB-", component: "RBC", units: 36, expiry: "2026-12-08" },
  { id: 7, group: "O+", component: "RBC", units: 150, expiry: "2026-12-12" },
  { id: 8, group: "O-", component: "RBC", units: 15, expiry: "2026-11-30" },
  { id: 9, group: "A+", component: "Platelets", units: 35, expiry: "2026-11-27" },
  { id: 10, group: "B+", component: "Plasma", units: 55, expiry: "2026-12-15" },
  { id: 11, group: "O+", component: "Platelets", units: 28, expiry: "2026-11-29" },
];

const initialTransactions = [
  { id: 1, action: "Stock Added", group: "A+ RBC", units: "+20", date: "Today, 10:30 AM" },
  { id: 2, action: "Blood Issued", group: "O+ RBC", units: "-12", date: "Today, 09:15 AM" },
  { id: 3, action: "Stock Added", group: "B+ Plasma", units: "+15", date: "Yesterday" },
];

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const components = ["RBC", "Platelets", "Plasma"];
const statuses = ["All", "Healthy", "Low Stock", "Critical"];

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100";

export default function InventoryPage() {
  const [inventory, setInventory] = useState(initialInventory);
  const [transactions, setTransactions] = useState(initialTransactions);

  const [search, setSearch] = useState("");
  const [componentFilter, setComponentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const [today, setToday] = useState(null);
  const [todayString, setTodayString] = useState("");

  const [form, setForm] = useState({
    group: "A+",
    component: "RBC",
    units: "",
    expiry: "",
  });

  // Get today's date after the component mounts.
  useEffect(() => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");

    setToday(currentDate);
    setTodayString(`${year}-${month}-${day}`);
  }, []);

  // Calculate stock status dynamically.
  function getStatus(units) {
    if (units < 25) return "Critical";
    if (units < 50) return "Low Stock";
    return "Healthy";
  }

  const totalUnits = inventory.reduce(
    (sum, item) => sum + item.units,
    0
  );

  const lowStock = inventory.filter(
    (item) => getStatus(item.units) !== "Healthy"
  ).length;

  const expiringSoon = today
    ? inventory.filter((item) => {
        const expiryDate = new Date(`${item.expiry}T00:00:00`);
        const days =
          (expiryDate - today) / (1000 * 60 * 60 * 24);

        return days >= 0 && days <= 7;
      }).length
    : 0;

  // Statistics for reusable StatCard component.
  const stats = [
    {
      title: "Total Blood Units",
      value: totalUnits,
      icon: Droplet,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "Inventory Records",
      value: inventory.length,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Low / Critical Stock",
      value: lowStock,
      icon: AlertTriangle,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Expiring Within 7 Days",
      value: expiringSoon,
      icon: Clock,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  // Search and filter inventory.
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch =
        item.group.toLowerCase().includes(search.toLowerCase()) ||
        item.component.toLowerCase().includes(search.toLowerCase());

      const matchesComponent =
        componentFilter === "All" ||
        item.component === componentFilter;

      const matchesStatus =
        statusFilter === "All" ||
        getStatus(item.units) === statusFilter;

      return matchesSearch && matchesComponent && matchesStatus;
    });
  }, [inventory, search, componentFilter, statusFilter]);

  // Add new stock.
  function addStock(e) {
    e.preventDefault();

    const quantity = Number(form.units);

    if (
      !Number.isInteger(quantity) ||
      quantity <= 0 ||
      !form.expiry
    ) {
      alert("Enter a valid quantity and expiry date.");
      return;
    }

    const existing = inventory.find(
      (item) =>
        item.group === form.group &&
        item.component === form.component &&
        item.expiry === form.expiry
    );

    if (existing) {
      setInventory((prev) =>
        prev.map((item) =>
          item.id === existing.id
            ? {
                ...item,
                units: item.units + quantity,
              }
            : item
        )
      );
    } else {
      setInventory((prev) => [
        ...prev,
        {
          id: Date.now(),
          group: form.group,
          component: form.component,
          units: quantity,
          expiry: form.expiry,
        },
      ]);
    }

    setTransactions((prev) => [
      {
        id: Date.now(),
        action: "Stock Added",
        group: `${form.group} ${form.component}`,
        units: `+${quantity}`,
        date: "Just now",
      },
      ...prev,
    ]);

    setShowModal(false);

    setForm({
      group: "A+",
      component: "RBC",
      units: "",
      expiry: "",
    });
  }

  // Repeated form fields.
  const formFields = [
    {
      name: "units",
      label: "Number of Units",
      type: "number",
      placeholder: "Enter quantity",
      min: "1",
    },
    {
      name: "expiry",
      label: "Expiry Date",
      type: "date",
      min: todayString || undefined,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <main className="space-y-7 p-5 md:p-8">

        {/* Header */}
        <section className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Blood Inventory</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage blood stock, components and expiry information.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700"
          >
            <Plus size={18} />
            Add Blood Stock
          </button>
        </section>

        {/* Statistics using reusable StatCard */}
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              bg={stat.bg}
            />
          ))}
        </section>

        {/* Inventory Table */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <h2 className="font-bold">Inventory Records</h2>
              <p className="mt-1 text-sm text-gray-500">
                Blood group-wise component inventory
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap gap-3 px-5 pb-5">
            <div className="flex min-w-48 flex-1 items-center gap-2 rounded-lg border px-3">
              <Search size={18} className="text-gray-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search blood group or component..."
                className="w-full py-2.5 text-sm outline-none"
              />
            </div>

            <select
              value={componentFilter}
              onChange={(e) => setComponentFilter(e.target.value)}
              className="rounded-lg border bg-white px-3 py-2 text-sm outline-none"
            >
              <option value="All">All Components</option>

              {components.map((component) => (
                <option key={component} value={component}>
                  {component}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border bg-white px-3 py-2 text-sm outline-none"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "All" ? "All Statuses" : status}
                </option>
              ))}
            </select>
          </div>

          {/* Inventory Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-gray-500">
                <tr>
                  {[
                    "Blood Group",
                    "Component",
                    "Available Units",
                    "Expiry Date",
                    "Stock Status",
                  ].map((heading) => (
                    <th key={heading} className="px-5 py-4">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredInventory.map((item) => {
                  const status = getStatus(item.units);

                  const statusStyles = {
                    Healthy: "bg-green-50 text-green-700",
                    "Low Stock": "bg-orange-50 text-orange-700",
                    Critical: "bg-red-50 text-red-700",
                  };

                  return (
                    <tr
                      key={item.id}
                      className="border-t transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 font-bold">
                        {item.group}
                      </td>

                      <td className="px-5 py-4">
                        {item.component}
                      </td>

                      <td className="px-5 py-4 font-semibold">
                        {item.units}
                      </td>

                      <td className="px-5 py-4">
                        {item.expiry}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status]}`}
                        >
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {filteredInventory.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-gray-500"
                    >
                      No inventory records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t px-5 py-4 text-xs text-gray-500">
            Showing {filteredInventory.length} of {inventory.length} records
          </div>
        </section>

        {/* Recent Transactions */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="font-bold">Recent Stock Transactions</h2>
            <p className="text-sm text-gray-500">
              Latest inventory updates
            </p>
          </div>

          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-red-50 p-3 text-red-600">
                    <Droplet size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      {transaction.action}
                    </p>

                    <p className="text-xs text-gray-500">
                      {transaction.group}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {transaction.date}
                    </p>
                  </div>
                </div>

                <span
                  className={`font-bold ${
                    transaction.units.startsWith("+")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.units} Units
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Add Stock Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Add Blood Stock</h2>
                <p className="text-sm text-gray-500">
                  Enter the new blood stock details.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={addStock} className="space-y-4">

              {/* Blood Group */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Blood Group
                </label>

                <select
                  value={form.group}
                  onChange={(e) =>
                    setForm({ ...form, group: e.target.value })
                  }
                  className={inputClass}
                >
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              {/* Component */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Component
                </label>

                <select
                  value={form.component}
                  onChange={(e) =>
                    setForm({ ...form, component: e.target.value })
                  }
                  className={inputClass}
                >
                  {components.map((component) => (
                    <option key={component} value={component}>
                      {component}
                    </option>
                  ))}
                </select>
              </div>

              {/* Repeated Form Fields */}
              {formFields.map((field) => (
                <div key={field.name}>
                  <label className="mb-2 block text-sm font-medium">
                    {field.label}
                  </label>

                  <input
                    type={field.type}
                    min={field.min}
                    required
                    placeholder={field.placeholder}
                    value={form[field.name]}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [field.name]: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </div>
              ))}

              <button
                type="submit"
                className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white hover:bg-red-700"
              >
                Add Stock
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
