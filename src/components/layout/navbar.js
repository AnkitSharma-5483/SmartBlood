
"use client";

import { Bell, Menu } from "lucide-react";

export default function Navbar({ title, onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-white px-5 py-4 md:px-8">

      {/* Left section */}
      <div className="flex items-center gap-3">

        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="rounded-lg border p-2 hover:bg-gray-50 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div>
          <h2 className="text-xl font-bold text-slate-800">
            {title}
          </h2>

          <p className="hidden text-sm text-gray-500 sm:block">
            SmartBlood Hospital Management System
          </p>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">

        {/* Notifications */}
        <button className="relative rounded-lg border p-2 hover:bg-gray-50">
          <Bell size={19} />

          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3">

          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-gray-800">
              Hospital Admin
            </p>

            <p className="text-xs text-gray-500">
              Administrator
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 font-bold text-red-600">
            HA
          </div>

        </div>
      </div>
    </header>
  );
}
