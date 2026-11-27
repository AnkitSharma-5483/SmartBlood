
"use client";

import { useState } from "react";
import {
  TrendingUp,
  CalendarDays,
  Activity,
  BrainCircuit,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Droplet,
} from "lucide-react";

import StatCard from "@/components/ui/statcard";
import DataTable from "@/components/ui/datatable";
import StatusBadge from "@/components/ui/statusbadge";

// DEMO DATA - Replace with FastAPI response later

const forecastData = [
  { day: "Mon", date: "Nov 30", actual: 42, predicted: 45 },
  { day: "Tue", date: "Dec 01", actual: 48, predicted: 51 },
  { day: "Wed", date: "Dec 02", actual: 55, predicted: 53 },
  { day: "Thu", date: "Dec 03", actual: 39, predicted: 43 },
  { day: "Fri", date: "Dec 04", actual: 62, predicted: 65 },
  { day: "Sat", date: "Dec 05", actual: 58, predicted: 61 },
  { day: "Sun", date: "Dec 06", actual: 47, predicted: 50 },
];

const bloodGroups = [
  { group: "A+", demand: 95, change: "+8.2%", trend: "up" },
  { group: "A-", demand: 32, change: "+3.1%", trend: "up" },
  { group: "B+", demand: 78, change: "-2.4%", trend: "down" },
  { group: "B-", demand: 24, change: "+5.6%", trend: "up" },
  { group: "AB+", demand: 18, change: "+1.8%", trend: "up" },
  { group: "AB-", demand: 12, change: "-1.2%", trend: "down" },
  { group: "O+", demand: 110, change: "+9.5%", trend: "up" },
  { group: "O-", demand: 15, change: "+4.2%", trend: "up" },
];

const forecastTable = [
  { id: 1, date: "Nov 30, 2026", group: "A+", demand: 14, confidence: "High" },
  { id: 2, date: "Dec 01, 2026", group: "O+", demand: 18, confidence: "High" },
  { id: 3, date: "Dec 02, 2026", group: "B+", demand: 12, confidence: "Medium" },
  { id: 4, date: "Dec 03, 2026", group: "A+", demand: 16, confidence: "High" },
  { id: 5, date: "Dec 04, 2026", group: "O+", demand: 20, confidence: "Medium" },
  { id: 6, date: "Dec 05, 2026", group: "B+", demand: 13, confidence: "High" },
  { id: 7, date: "Dec 06, 2026", group: "AB+", demand: 8, confidence: "Medium" },
];

const components = ["RBC", "Platelets", "Plasma"];

export default function ForecastPage() {
  const [component, setComponent] = useState("RBC");
  const [selectedGroup, setSelectedGroup] = useState("All");

  // Generate forecast loading state
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState(false);

  // Forecast calculations
  const totalDemand = forecastData.reduce(
    (sum, item) => sum + item.predicted,
    0
  );

  const peakDay = forecastData.reduce((max, item) =>
    item.predicted > max.predicted ? item : max
  );

  const maxValue = Math.max(
    ...forecastData.map((item) =>
      Math.max(item.actual, item.predicted)
    )
  );

  // Filter forecast table by blood group
  const filteredTable = forecastTable.filter(
    (item) =>
      selectedGroup === "All" || item.group === selectedGroup
  );

  // Reusable StatCard data
  const stats = [
    {
      title: "Predicted Demand",
      value: `${totalDemand} Units`,
      change: "Next 7 days",
      icon: TrendingUp,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "Forecast Horizon",
      value: "7 Days",
      change: "Prediction period",
      icon: CalendarDays,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Peak Demand",
      value: `${peakDay.predicted} Units`,
      change: `Peak on ${peakDay.day}`,
      icon: Activity,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "ML Model",
      value: "XGBoost",
      change: "Regression model",
      icon: BrainCircuit,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  // Generate temporary demo forecast
  function generateForecast() {
    if (isGenerating) return;

    setIsGenerating(true);
    setLastGenerated(false);

    setTimeout(() => {
      setIsGenerating(false);
      setLastGenerated(true);
    }, 800);
  }

  // Table headings
  const tableHeadings = [
    "Date",
    "Blood Group",
    "Predicted Demand",
    "Confidence",
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <main className="space-y-7 p-5 md:p-8">

        {/* Header */}
        <section className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              Demand Forecasting
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              ML-powered blood demand prediction and analytics for {component}.
            </p>
          </div>

          <button
            onClick={generateForecast}
            disabled={isGenerating}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={isGenerating ? "animate-spin" : ""}
            />

            {isGenerating ? "Generating..." : "Generate Forecast"}
          </button>
        </section>

        {/* Demo confirmation */}
        {lastGenerated && (
          <p className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            Demo forecast refreshed successfully. No live ML prediction was generated.
          </p>
        )}

        {/* Filters */}
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CalendarDays size={18} className="text-gray-500" />
            Forecast Horizon: Next 7 Days
          </div>

          <select
            value={component}
            onChange={(e) => setComponent(e.target.value)}
            className="rounded-lg border border-slate-200 shadow-sm bg-white px-4 py-2 text-sm outline-none"
          >
            {components.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </section>

        {/* Overview Cards */}
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              icon={stat.icon}
              color={stat.color}
              bg={stat.bg}
            />
          ))}
        </section>

        {/* Actual vs Predicted Chart */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-bold">
                Actual vs Predicted Demand
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Daily {component} demand comparison
              </p>
            </div>

            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                Actual
              </span>

              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                Predicted
              </span>
            </div>
          </div>

          <div className="flex h-64 items-end justify-around gap-3 border-b border-l px-3 pb-2">
            {forecastData.map((item) => (
              <div
                key={item.day}
                className="relative flex h-full flex-1 items-end justify-center gap-1"
              >
                <div className="flex h-full w-full items-end justify-center gap-1">
                  <div
                    title={`Actual: ${item.actual}`}
                    className="w-1/3 max-w-8 rounded-t bg-slate-400"
                    style={{
                      height: `${(item.actual / maxValue) * 85}%`,
                    }}
                  />

                  <div
                    title={`Predicted: ${item.predicted}`}
                    className="w-1/3 max-w-8 rounded-t bg-red-500"
                    style={{
                      height: `${(item.predicted / maxValue) * 85}%`,
                    }}
                  />
                </div>

                <span className="absolute -bottom-7 text-xs text-gray-500">
                  {item.day}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-9 text-xs text-gray-400">
            Values shown are illustrative demo data, not live model predictions.
          </p>
        </section>

        {/* Blood Group Forecast */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-5">
            <h2 className="font-bold">
              Blood Group-wise Forecast
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Predicted demand for each blood group
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {bloodGroups.map((item) => (
              <div
                key={item.group}
                className="rounded-xl border p-4 border-slate-200 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">
                    {item.group}
                  </span>

                  <Droplet size={19} className="text-red-500" />
                </div>

                <h3 className="mt-4 text-2xl font-bold">
                  {item.demand}
                  <span className="ml-1 text-xs font-normal text-gray-500">
                    units
                  </span>
                </h3>

                <div className="mt-3 flex items-center gap-1 text-xs">
                  {item.trend === "up" ? (
                    <ArrowUpRight size={15} className="text-red-600" />
                  ) : (
                    <ArrowDownRight size={15} className="text-green-600" />
                  )}

                  <span
                    className={
                      item.trend === "up"
                        ? "text-red-600"
                        : "text-green-600"
                    }
                  >
                    {item.change}
                  </span>

                  <span className="text-gray-400">
                    vs previous period
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Forecast Table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <h2 className="font-bold">
                Detailed Forecast
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Daily predicted {component} requirements
              </p>
            </div>

            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="rounded-lg border border-slate-200 shadow-sm bg-white px-3 py-2 text-sm outline-none"
            >
              <option value="All">All Blood Groups</option>

              {bloodGroups.map((item) => (
                <option key={item.group} value={item.group}>
                  {item.group}
                </option>
              ))}
            </select>
          </div>

          {/* Reusable DataTable */}
          <DataTable
            columns={tableHeadings}
            data={filteredTable}
            minWidth="650px"
            emptyMessage="No forecast records found."
            renderRow={(item) => (
              <tr key={item.id} className="border-t">
                <td className="px-5 py-4">
                  {item.date}
                </td>

                <td className="px-5 py-4 font-semibold">
                  {item.group}
                </td>

                <td className="px-5 py-4 font-semibold">
                  {item.demand} Units
                </td>

                <td className="px-5 py-4">
                  <StatusBadge
                    status={item.confidence}
                    variant="confidence"
                  />
                </td>
              </tr>
            )}
          />

        </section>

        {/* Model Information */}
        <section className="rounded-xl border border-red-100 bg-red-50 p-5">
          <div className="flex gap-3">
            <BrainCircuit
              className="mt-1 shrink-0 text-red-600"
              size={22}
            />

            <div>
              <h3 className="font-bold text-red-800">
                Model Information
              </h3>

              <p className="mt-2 text-sm leading-6 text-red-700">
                SmartBlood uses an XGBoost regression model to estimate
                future blood demand using historical demand patterns,
                temporal features and other relevant input variables.
                Forecasts are intended to support hospital inventory
                planning and decision-making.
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
