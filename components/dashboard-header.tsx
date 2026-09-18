import React from "react";
import { Factory, Bell, User } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left: Branding */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded bg-slate-900 text-white">
              <Factory className="w-4 h-4" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-semibold text-slate-900 text-sm sm:text-base tracking-tight">
                Production Control
              </span>
              <span className="text-xs text-slate-500 font-normal hidden sm:inline-block border-l border-slate-300 pl-2">
                Plant Floor Operations
              </span>
            </div>
          </div>

          {/* Right: Operational Status & Manager Profile */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium hidden md:inline">Line 1-4 Active</span>
              <span className="text-slate-400">|</span>
              <span>Shift 1</span>
            </div>

            <button
              type="button"
              className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
            </button>

            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 text-xs font-semibold">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-medium text-slate-900 leading-none">M. Vance</div>
                <div className="text-[10px] text-slate-500 leading-tight">Operations Manager</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
