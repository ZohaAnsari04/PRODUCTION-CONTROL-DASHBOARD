import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  label: string;
  value: number;
  subtext: string;
  icon: LucideIcon;
  variant?: "default" | "warning" | "alert" | "success";
  id?: string;
}

export function SummaryCard({
  label,
  value,
  subtext,
  icon: Icon,
  variant = "default",
  id,
}: SummaryCardProps) {
  const variantStyles = {
    default: {
      border: "border-slate-200",
      iconBg: "bg-slate-100 text-slate-700",
      accent: "text-slate-900",
    },
    alert: {
      border: "border-rose-200 bg-rose-50/30",
      iconBg: "bg-rose-100 text-rose-700",
      accent: "text-rose-900",
      subtextColor: "text-rose-600 font-medium",
    },
    warning: {
      border: "border-amber-200 bg-amber-50/20",
      iconBg: "bg-amber-100 text-amber-700",
      accent: "text-amber-900",
    },
    success: {
      border: "border-emerald-200 bg-emerald-50/20",
      iconBg: "bg-emerald-100 text-emerald-700",
      accent: "text-emerald-900",
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <div
      id={id}
      className={cn(
        "bg-white rounded-lg border p-4 shadow-2xs transition-all duration-200",
        currentVariant.border
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {label}
        </span>
        <div className={cn("w-8 h-8 rounded-md flex items-center justify-center shrink-0", currentVariant.iconBg)}>
          <Icon className="w-4 h-4" aria-hidden="true" />
        </div>
      </div>
      <div className="mt-2 flex items-baseline">
        <span className={cn("text-2xl sm:text-3xl font-bold tracking-tight", currentVariant.accent)}>
          {value}
        </span>
      </div>
      <p
        className={cn(
          "mt-1 text-xs text-slate-500 truncate",
          "subtextColor" in currentVariant && currentVariant.subtextColor
        )}
      >
        {subtext}
      </p>
    </div>
  );
}
