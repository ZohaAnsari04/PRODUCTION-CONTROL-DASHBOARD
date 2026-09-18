import React from "react";
import { Job, SortDirection, SortField } from "@/types/job";
import { StatusBadge } from "./status-badge";
import { formatDisplayDate, isDueToday, isOverdue } from "@/lib/date-utils";
import { EmptyState } from "./empty-state";
import { ArrowUp, ArrowDown, Cpu, MessageSquare, AlertOctagon } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobsTableProps {
  jobs: Job[];
  selectedJobId: string | null;
  onSelectJob: (jobId: string) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField, direction: SortDirection) => void;
  onResetFilters: () => void;
  hasFilters: boolean;
}

export function JobsTable({
  jobs,
  selectedJobId,
  onSelectJob,
  sortField,
  sortDirection,
  onResetFilters,
  hasFilters,
  onSortChange,
}: JobsTableProps) {
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      onSortChange(field, sortDirection === "asc" ? "desc" : "asc");
    } else {
      onSortChange(field, "asc");
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" id="jobs-table">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <th scope="col" className="py-3 px-4 w-[110px]">
                Job ID
              </th>
              <th scope="col" className="py-3 px-4">
                Product
              </th>
              <th scope="col" className="py-3 px-4">
                Customer
              </th>
              <th scope="col" className="py-3 px-4 text-right w-[110px]">
                <button
                  type="button"
                  onClick={() => handleSort("quantity")}
                  className="inline-flex items-center gap-1 hover:text-slate-900 transition-colors uppercase font-semibold text-xs ml-auto"
                  aria-label="Sort by quantity"
                >
                  <span>Quantity</span>
                  {sortField === "quantity" && (
                    sortDirection === "asc" ? (
                      <ArrowUp className="w-3.5 h-3.5 text-slate-900" />
                    ) : (
                      <ArrowDown className="w-3.5 h-3.5 text-slate-900" />
                    )
                  )}
                </button>
              </th>
              <th scope="col" className="py-3 px-4 w-[150px]">
                <button
                  type="button"
                  onClick={() => handleSort("dueDate")}
                  className="inline-flex items-center gap-1 hover:text-slate-900 transition-colors uppercase font-semibold text-xs"
                  aria-label="Sort by due date"
                >
                  <span>Due Date</span>
                  {sortField === "dueDate" && (
                    sortDirection === "asc" ? (
                      <ArrowUp className="w-3.5 h-3.5 text-slate-900" />
                    ) : (
                      <ArrowDown className="w-3.5 h-3.5 text-slate-900" />
                    )
                  )}
                </button>
              </th>
              <th scope="col" className="py-3 px-4 w-[135px]">
                Status
              </th>
              <th scope="col" className="py-3 px-4 w-[130px]">
                Assigned Machine
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-0">
                  <EmptyState onReset={onResetFilters} hasFilters={hasFilters} />
                </td>
              </tr>
            ) : (
              jobs.map((job) => {
                const isSelected = selectedJobId === job.id;
                const dueToday = isDueToday(job.dueDate) && job.status !== "Completed";
                const overdue = isOverdue(job.dueDate) && job.status !== "Completed";

                return (
                  <tr
                    key={job.id}
                    id={`job-row-${job.jobId}`}
                    onClick={() => onSelectJob(job.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onSelectJob(job.id);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${job.jobId} ${job.productName}`}
                    className={cn(
                      "cursor-pointer transition-colors group focus:outline-none focus:bg-slate-100/70",
                      isSelected
                        ? "bg-blue-50/60 font-medium"
                        : "hover:bg-slate-50/80 bg-white"
                    )}
                  >
                    {/* Job ID */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono text-xs font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {job.jobId}
                      </span>
                    </td>

                    {/* Product */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">{job.productName}</span>
                        {job.notes && (
                          <span
                            title="Notes available"
                            className="text-slate-400 group-hover:text-slate-600 transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {job.customer}
                    </td>

                    {/* Quantity */}
                    <td className="py-3 px-4 text-right font-mono text-slate-800 whitespace-nowrap">
                      {job.quantity.toLocaleString()}
                    </td>

                    {/* Due Date */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "text-slate-700",
                            overdue && "text-rose-600 font-medium",
                            dueToday && "text-amber-700 font-medium"
                          )}
                        >
                          {formatDisplayDate(job.dueDate)}
                        </span>
                        {dueToday && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200 uppercase">
                            Today
                          </span>
                        )}
                        {overdue && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-rose-100 text-rose-800 border border-rose-200 uppercase">
                            <AlertOctagon className="w-2.5 h-2.5" />
                            Overdue
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={job.status} />
                    </td>

                    {/* Assigned Machine */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-600 font-mono">
                        <Cpu className="w-3 h-3 text-slate-400" />
                        <span>{job.assignedMachine}</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
