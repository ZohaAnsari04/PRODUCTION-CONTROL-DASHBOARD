import React from "react";
import { Layers, AlertTriangle, CalendarClock, CheckCircle } from "lucide-react";
import { SummaryMetrics } from "@/types/job";
import { SummaryCard } from "./summary-card";

interface SummaryCardsProps {
  metrics: SummaryMetrics;
}

export function SummaryCards({ metrics }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <SummaryCard
        id="metric-total-jobs"
        label="Total Jobs"
        value={metrics.totalJobs}
        subtext="Across all active work orders"
        icon={Layers}
        variant="default"
      />
      <SummaryCard
        id="metric-delayed-jobs"
        label="Delayed Jobs"
        value={metrics.delayedJobs}
        subtext="Requires attention"
        icon={AlertTriangle}
        variant={metrics.delayedJobs > 0 ? "alert" : "default"}
      />
      <SummaryCard
        id="metric-due-soon-jobs"
        label="Due Today / Soon"
        value={metrics.dueSoonJobs}
        subtext="Due within the next 2 days"
        icon={CalendarClock}
        variant="warning"
      />
      <SummaryCard
        id="metric-completed-jobs"
        label="Completed Jobs"
        value={metrics.completedJobs}
        subtext="Production completed"
        icon={CheckCircle}
        variant="success"
      />
    </div>
  );
}
