import React from "react";
import { Clock } from "lucide-react";

interface PageHeaderProps {
  lastUpdated?: string;
}

export function PageHeader({ lastUpdated = "Today at 21:45" }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-5 border-b border-slate-200">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Production Control Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Monitor production jobs, machine assignments, deadlines, and operational issues.
        </p>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-slate-500 self-start sm:self-auto bg-white px-2.5 py-1 rounded border border-slate-200 shadow-2xs">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        <span>Last updated: {lastUpdated}</span>
      </div>
    </div>
  );
}
