
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import Sidebar from "./sidebar";
import Navbar from "./navbar";

const pageTitles = {
  "/dashboard": "Dashboard Overview",
  "/inventory": "Blood Inventory",
  "/forecasts": "Demand Forecast",
  "/risk-alerts": "Risk Analysis",
  "/explainability": "Model Explainability",
  "/requests": "Blood Requests",
};

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pathname = usePathname();

  const pageTitle = pageTitles[pathname] || "SmartBlood";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main area */}
      <main className="min-h-screen lg:ml-64">

        {/* Navbar */}
        <Navbar
          title={pageTitle}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Page content */}
        <div className="p-5 md:p-8">
          {children}
        </div>

      </main>
    </div>
  );
}
