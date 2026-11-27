
"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ShieldAlert,
  TrendingDown,
  Clock,
  ArrowRight,
  Activity,
  RefreshCw,
  Info,
} from "lucide-react";

import StatCard from "@/components/ui/statcard";
import DataTable from "@/components/ui/datatable";
import SearchBar from "@/components/ui/searchbar";
import StatusBadge from "@/components/ui/statusbadge";

// DEMO DATA - Replace with actual risk engine API response

const initialRisks = [
  {
    id: 1,
    group: "O-",
    component: "RBC",
    currentStock: 15,
    forecastDemand: 45,
    safetyStock: 25,
    shortageGap: 55,
    expiryUnits: 2,
    risk: "Critical",
    type: "Shortage",
    action: "Urgent stock replenishment",
    status: "Active",
  },
  {
    id: 2,
    group: "AB+",
    component: "RBC",
    currentStock: 18,
    forecastDemand: 30,
    safetyStock: 20,
    shortageGap: 32,
    expiryUnits: 1,
    risk: "Critical",
    type: "Shortage",
    action: "Arrange additional stock",
    status: "Active",
  },
  {
    id: 3,
    group: "B-",
    component: "RBC",
    currentStock: 22,
    forecastDemand: 35,
    safetyStock: 20,
    shortageGap: 33,
    expiryUnits: 0,
    risk: "High",
    type: "Shortage",
    action: "Monitor and replenish",
    status: "Active",
  },
  {
    id: 4,
    group: "A+",
    component: "RBC",
    currentStock: 320,
    forecastDemand: 80,
    safetyStock: 40,
    shortageGap: 0,
    expiryUnits: 15,
    risk: "High",
    type: "Excess Stock",
    action: "Review future collection",
    status: "Active",
  },
  {
    id: 5,
    group: "B+",
    component: "RBC",
    currentStock: 280,
    forecastDemand: 90,
    safetyStock: 45,
    shortageGap: 0,
    expiryUnits: 8,
    risk: "Medium",
    type: "Expiry",
    action: "Prioritize earliest expiry units",
    status: "Active",
  },
  {
    id: 6,
    group: "O+",
    component: "RBC",
    currentStock: 410,
    forecastDemand: 120,
    safetyStock: 50,
    shortageGap: 0,
    expiryUnits: 12,
    risk: "Medium",
    type: "Excess Stock",
    action: "Review inventory allocation",
    status: "Active",
  },
  {
    id: 7,
    group: "A-",
    component: "RBC",
    currentStock: 85,
    forecastDemand: 65,
    safetyStock: 30,
    shortageGap: 10,
    expiryUnits: 3,
    risk: "Low",
    type: "Expiry",
    action: "Monitor expiry dates",
    status: "Active",
  },
];

const recommendations = [
  {
    title: "Urgent O- Stock Replenishment",
    description:
      "O- inventory is below projected requirements. Review replenishment options.",
    priority: "Critical",
    type: "Shortage",
  },
  {
    title: "Review A+ Collection",
    description:
      "A+ inventory exceeds projected demand. Review upcoming collection plans.",
    priority: "High",
    type: "Excess Stock",
  },
  {
    title: "Prioritize B+ Units",
    description:
      "Several B+ units are approaching expiry. Apply FEFO inventory management.",
    priority: "Medium",
    type: "Expiry",
  },
];

const riskFilters = [
  "All",
  "Shortage",
  "Excess Stock",
  "Expiry",
];

const tableHeadings = [
  "Blood Group",
  "Current Stock",
  "Forecast Demand",
  "Safety Stock",
  "Risk Type",
  "Risk Level",
  "Action",
];

const distributionTypes = [
  {
    title: "Shortage Risk",
    type: "Shortage",
    color: "bg-red-500",
  },
  {
    title: "Excess Stock Risk",
    type: "Excess Stock",
    color: "bg-orange-500",
  },
  {
    title: "Expiry Risk",
    type: "Expiry",
    color: "bg-purple-500",
  },
];

export default function RiskAnalysisPage() {
  const [risks, setRisks] = useState(initialRisks);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  // Only active risks are included in statistics

  const activeRisks = risks.filter(
    (item) => item.status === "Active"
  );

  // Risk statistics

  const criticalCount = activeRisks.filter(
    (item) => item.risk === "Critical"
  ).length;

  const shortageCount = activeRisks.filter(
    (item) => item.type === "Shortage"
  ).length;

  const excessCount = activeRisks.filter(
    (item) => item.type === "Excess Stock"
  ).length;

  const expiryCount = activeRisks.filter(
    (item) => item.type === "Expiry"
  ).length;

  // Stat cards

  const stats = [
    {
      title: "Total Risk Alerts",
      value: activeRisks.length,
      icon: Activity,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Critical Risks",
      value: criticalCount,
      icon: ShieldAlert,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "Shortage Risks",
      value: shortageCount,
      icon: TrendingDown,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Expiry Risks",
      value: expiryCount,
      icon: Clock,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  // Search and filter

  const filteredRisks = risks.filter((item) => {
    const matchesFilter =
      filter === "All" || item.type === filter;

    const searchTerm = search.toLowerCase();

    const matchesSearch =
      item.group.toLowerCase().includes(searchTerm) ||
      item.component.toLowerCase().includes(searchTerm) ||
      item.risk.toLowerCase().includes(searchTerm) ||
      item.status.toLowerCase().includes(searchTerm);

    return matchesFilter && matchesSearch;
  });

  // Resolve risk

  function resolveRisk(id) {
    setRisks((prev) =>
      prev.map((item) =>
        item.id === id && item.status === "Active"
          ? { ...item, status: "Resolved" }
          : item
      )
    );
  }

  // Distribution counts

  const distributionCounts = {
    Shortage: shortageCount,
    "Excess Stock": excessCount,
    Expiry: expiryCount,
  };

  // Critical active risks

  const activeCriticalRisks = activeRisks.filter(
    (item) => item.risk === "Critical"
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <main className="space-y-7 p-5 md:p-8">

        {/* Header */}

        <section className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              Risk Analysis
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              AI-assisted blood inventory risk monitoring and decision support.
            </p>
          </div>

          <button
            onClick={() =>
              alert(
                "Connect this button to your FastAPI risk endpoint."
              )
            }
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <RefreshCw size={17} />
            Run Risk Analysis
          </button>
        </section>

        {/* Risk Overview - StatCard */}

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
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

        {/* Risk Distribution + Critical Alerts */}

        <section className="grid gap-5 lg:grid-cols-3">

          {/* Risk Distribution */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold">
              Risk Distribution
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Identified inventory risk categories
            </p>

            <div className="mt-7 space-y-6">
              {distributionTypes.map((item) => {
                const value = distributionCounts[item.type];

                const percentage = activeRisks.length
                  ? (value / activeRisks.length) * 100
                  : 0;

                return (
                  <div key={item.type}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.title}
                      </span>

                      <span className="font-bold">
                        {value}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Critical Inventory Alerts */}

          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle
                className="text-red-600"
                size={22}
              />

              <h2 className="font-bold">
                Critical Inventory Alerts
              </h2>
            </div>

            <div className="mt-5 space-y-4">
              {activeCriticalRisks.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-100 bg-red-50 p-4"
                >
                  <div>
                    <p className="font-semibold text-red-800">
                      {item.group} {item.component} Shortage
                    </p>

                    <p className="mt-1 text-xs text-red-700">
                      Current: {item.currentStock} units | Forecast:{" "}
                      {item.forecastDemand} units
                    </p>
                  </div>

                  <StatusBadge status="Critical" />
                </div>
              ))}

              {activeCriticalRisks.length === 0 && (
                <p className="py-6 text-center text-sm text-gray-500">
                  No critical risks currently identified.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Risk Assessment Table */}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="p-5">
            <h2 className="font-bold">
              Inventory Risk Assessment
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Detailed blood group-wise risk evaluation
            </p>
          </div>

          {/* Search and Filters */}

          <div className="flex flex-wrap gap-3 px-5 pb-5">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search blood group or risk..."
              iconSize={17}
              inputClassName="focus:border-red-400 focus:ring-red-100"
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-red-400"
            >
              {riskFilters.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Table */}

          <DataTable
            columns={tableHeadings}
            data={filteredRisks}
            minWidth="950px"
            emptyMessage="No matching risk records found."
            renderRow={(item) => (
              <tr
                key={item.id}
                className="border-t transition hover:bg-slate-50"
              >
                <td className="px-5 py-4 font-bold">
                  {item.group} {item.component}
                </td>

                <td className="px-5 py-4">
                  {item.currentStock}
                </td>

                <td className="px-5 py-4">
                  {item.forecastDemand}
                </td>

                <td className="px-5 py-4">
                  {item.safetyStock}
                </td>

                <td className="px-5 py-4">
                  {item.type}
                </td>

                <td className="px-5 py-4">
                  <StatusBadge status={item.risk} />
                </td>

                <td className="px-5 py-4">
                  {item.status === "Resolved" ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Resolved
                    </span>
                  ) : (
                    <button
                      onClick={() => resolveRisk(item.id)}
                      className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      Resolve
                    </button>
                  )}
                </td>
              </tr>
            )}
          />

          <div className="border-t px-5 py-3 text-xs text-gray-500">
            Showing {filteredRisks.length} of {risks.length} risk records
          </div>
        </section>

        {/* Recommended Actions */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-5">
            <h2 className="font-bold">
              Recommended Actions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Suggested inventory management decisions
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {recommendations.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border p-4 transition border-slate-200 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="text-sm font-bold">
                    {item.type}
                  </span>

                  <StatusBadge status={item.priority} />
                </div>

                <h3 className="font-semibold">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {item.description}
                </p>

                <button
                  onClick={() =>
                    alert(
                      "This recommendation is a demo. Connect it to your inventory workflow."
                    )
                  }
                  className="mt-4 flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
                >
                  View Recommendation
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Methodology */}

        <section className="rounded-xl border border-blue-100 bg-blue-50 p-5">
          <div className="flex gap-3">
            <Info
              className="mt-1 shrink-0 text-blue-600"
              size={22}
            />

            <div>
              <h3 className="font-bold text-blue-800">
                Risk Assessment Methodology
              </h3>

              <p className="mt-2 text-sm leading-6 text-blue-700">
                SmartBlood combines predicted demand, current inventory,
                safety stock and expiry-related information to identify
                potential inventory risks. Risk classifications and
                recommended actions should be generated by the backend
                risk engine.
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
