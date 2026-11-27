
"use client";

import { useState } from "react";
import {
  BrainCircuit,
  Activity,
  Target,
  ChartColumn,
  Lightbulb,
} from "lucide-react";

import StatCard from "@/components/ui/statcard";
import StatusBadge from "@/components/ui/statusbadge";

// DEMO DATA - Replace with actual SHAP values from your model

const features = [
  { name: "Previous Day Demand", importance: 92, impact: "Positive" },
  { name: "7-Day Average Demand", importance: 85, impact: "Positive" },
  { name: "Emergency Requests", importance: 76, impact: "Positive" },
  { name: "Previous Week Demand", importance: 68, impact: "Positive" },
  { name: "Day of Week", importance: 55, impact: "Variable" },
  { name: "Month", importance: 42, impact: "Variable" },
  { name: "Opening Stock", importance: 31, impact: "Negative" },
  { name: "Collection Quantity", importance: 25, impact: "Negative" },
];

const predictionDetails = [
  {
    feature: "Previous Day Demand",
    value: "52 units",
    impact: "+8.4",
    positive: true,
  },
  {
    feature: "7-Day Average Demand",
    value: "48 units",
    impact: "+5.2",
    positive: true,
  },
  {
    feature: "Emergency Requests",
    value: "8 requests",
    impact: "+4.1",
    positive: true,
  },
  {
    feature: "Opening Stock",
    value: "120 units",
    impact: "-3.5",
    positive: false,
  },
  {
    feature: "Collection Quantity",
    value: "40 units",
    impact: "-2.2",
    positive: false,
  },
];

const groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const components = ["RBC", "Platelets", "Plasma"];

const baseValue = 42;
const predictedValue = 54;

export default function ExplainabilityPage() {
  const [selectedGroup, setSelectedGroup] = useState("O+");
  const [selectedComponent, setSelectedComponent] = useState("RBC");

  const [selectedFeature, setSelectedFeature] = useState(
    "Previous Day Demand"
  );

  // Get currently selected feature details

  const activeFeature = features.find(
    (feature) => feature.name === selectedFeature
  );

  // Model overview statistics

  const stats = [
    {
      title: "ML Model",
      value: "XGBoost",
      description: "Regression Model",
      icon: BrainCircuit,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Explainability",
      value: "SHAP",
      description: "Shapley Values",
      icon: Activity,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Features",
      value: features.length,
      description: "Input Variables",
      icon: ChartColumn,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "Prediction",
      value: `${predictedValue} Units`,
      description: "Illustrative prediction",
      icon: Target,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <main className="space-y-7 p-5 md:p-8">

        {/* Header */}

        <section>
          <h1 className="text-2xl font-bold">
            Model Explainability
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Understand how the SmartBlood ML model generates its predictions.
          </p>
        </section>

        {/* Model Overview */}

        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              change={stat.description}
              icon={stat.icon}
              color={stat.color}
              bg={stat.bg}
            />
          ))}
        </section>

        {/* Individual Prediction Selector */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-5">
            <h2 className="font-bold">
              Individual Prediction Explanation
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Select a blood group and component to inspect a prediction.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            {/* Blood Group */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Blood Group
              </label>

              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
              >
                {groups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            {/* Blood Component */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Blood Component
              </label>

              <select
                value={selectedComponent}
                onChange={(e) => setSelectedComponent(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-red-400 focus:ring-2 focus:ring-red-100"
              >
                {components.map((component) => (
                  <option key={component} value={component}>
                    {component}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <p className="mt-4 text-xs text-gray-400">
            Selected: {selectedGroup} {selectedComponent}
          </p>
        </section>

        {/* Global Feature Importance */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-6">
            <h2 className="font-bold">
              Global Feature Importance
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Illustrative feature importance scores for model interpretation.
            </p>
          </div>

          <div className="space-y-5">

            {features.map((feature, index) => (
              <button
                key={feature.name}
                type="button"
                onClick={() => setSelectedFeature(feature.name)}
                className={`w-full rounded-xl border p-3 text-left transition ${
                  selectedFeature === feature.name
                    ? "border-red-300 bg-red-50"
                    : "border-transparent hover:bg-slate-50"
                }`}
              >

                <div className="mb-2 flex justify-between gap-3 text-sm">
                  <span className="font-medium">
                    {index + 1}. {feature.name}
                  </span>

                  <span className="text-gray-500">
                    {feature.importance}%
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-red-500 transition-all duration-500"
                    style={{
                      width: `${feature.importance}%`,
                    }}
                  />
                </div>

              </button>
            ))}

          </div>
        </section>

        {/* SHAP Impact Analysis */}

        <section className="grid gap-5 lg:grid-cols-2">

          {/* Feature Impact */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <h2 className="font-bold">
              Feature Impact Analysis
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Direction of feature influence in this demo.
            </p>

            <div className="mt-6 space-y-4">

              {features.slice(0, 6).map((feature) => (
                <button
                  key={feature.name}
                  type="button"
                  onClick={() => setSelectedFeature(feature.name)}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg border p-3 text-left transition ${
                    selectedFeature === feature.name
                      ? "border-blue-300 bg-blue-50"
                      : "border-transparent bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-sm font-medium">
                    {feature.name}
                  </span>

                  <StatusBadge status={feature.impact} />

                </button>
              ))}

            </div>
          </div>

          {/* Prediction Breakdown */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <h2 className="font-bold">
              Prediction Breakdown
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Example contribution of each input feature.
            </p>

            <div className="mt-6 space-y-5">

              {predictionDetails.map((item) => (
                <div key={item.feature}>

                  <div className="mb-2 flex justify-between gap-2 text-sm">
                    <span className="font-medium">
                      {item.feature}
                    </span>

                    <span
                      className={
                        item.positive
                          ? "font-semibold text-red-600"
                          : "font-semibold text-green-600"
                      }
                    >
                      {item.impact}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
                    <span>Input: {item.value}</span>

                    <span>
                      {item.positive
                        ? "Increases demand"
                        : "Decreases demand"}
                    </span>
                  </div>

                </div>
              ))}

            </div>

            {/* Prediction Summary */}

            <div className="mt-6 rounded-lg bg-red-50 p-4">

              <p className="text-sm text-red-700">
                Base Value: {baseValue} Units
              </p>

              <p className="mt-1 text-xl font-bold text-red-700">
                Predicted Demand: {predictedValue} Units
              </p>

              <p className="mt-1 text-xs text-red-600">
                Illustrative values only. Not calculated from your SHAP model.
              </p>

            </div>
          </div>
        </section>

        {/* Individual Feature Selector */}

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <h2 className="font-bold">
            Explore Feature Contributions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Select a feature to understand its role in the prediction.
          </p>

          <select
            value={selectedFeature}
            onChange={(e) => setSelectedFeature(e.target.value)}
            className="mt-5 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:w-80"
          >
            {features.map((feature) => (
              <option key={feature.name} value={feature.name}>
                {feature.name}
              </option>
            ))}
          </select>

          <div className="mt-5 rounded-lg bg-blue-50 p-5">

            <div className="flex gap-3">

              <Lightbulb className="shrink-0 text-blue-600" />

              <div>
                <h3 className="font-semibold text-blue-800">
                  Feature Explanation
                </h3>

                <p className="mt-2 text-sm leading-6 text-blue-700">
                  {selectedFeature} has an illustrative importance score of{" "}
                  {activeFeature?.importance}% in this demo.

                  Its displayed impact is{" "}
                  {activeFeature?.impact.toLowerCase()}.

                  Actual SHAP contributions must be obtained from the
                  trained model for the selected blood group and component.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Model Information */}

        <section className="rounded-xl border border-purple-100 bg-purple-50 p-5">

          <div className="flex gap-3">

            <BrainCircuit
              className="mt-1 shrink-0 text-purple-600"
              size={22}
            />

            <div>
              <h3 className="font-bold text-purple-800">
                How SmartBlood Explainability Works
              </h3>

              <p className="mt-2 text-sm leading-6 text-purple-700">
                SmartBlood uses SHAP to interpret the predictions generated
                by its XGBoost regression model. SHAP values estimate the
                contribution of individual features to a prediction relative
                to the model's expected output. This helps hospital
                administrators understand which factors influence predicted
                blood demand.
              </p>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
}
