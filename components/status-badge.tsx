import React from "react";
import { JobStatus } from "@/types/job";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Clock, PlayCircle } from "lucide-react";

interface StatusBadgeProps {
  status: JobStatus;
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({ status, className, showIcon = true }: StatusBadgeProps) {
  let style = "";
  let Icon = Clock;

  switch (status) {
    case "Pending":
      style = "bg-slate-100 text-slate-700 border-slate-200";
      Icon = Clock;
      break;
    case "In Progress":
      style = "bg-blue-50 text-blue-700 border-blue-200";
      Icon = PlayCircle;
      break;
    case "Delayed":
      style = "bg-rose-50 text-rose-700 border-rose-200 font-medium";
      Icon = AlertCircle;
      break;
    case "Completed":
      style = "bg-emerald-50 text-emerald-700 border-emerald-200";
      Icon = CheckCircle2;
      break;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs border font-medium whitespace-nowrap",
        style,
        className
      )}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />}
      <span>{status}</span>
    </span>
  );
}
