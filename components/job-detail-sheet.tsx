"use client";

import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Check, Cpu, Calendar, User, Package, AlertCircle, FileText, ArrowRight } from "lucide-react";
import { Job, JobStatus } from "@/types/job";
import { StatusBadge } from "./status-badge";
import { formatDisplayDate, isDueToday, isOverdue } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

interface JobDetailSheetProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (jobId: string, newStatus: JobStatus) => void;
}

interface JobDetailPanelContentProps {
  job: Job;
  onClose: () => void;
  onUpdateStatus: (jobId: string, newStatus: JobStatus) => void;
}

function JobDetailPanelContent({
  job,
  onClose,
  onUpdateStatus,
}: JobDetailPanelContentProps) {
  const [selectedStatus, setSelectedStatus] = useState<JobStatus>(job.status);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleUpdate = () => {
    if (selectedStatus === job.status) return;
    onUpdateStatus(job.id, selectedStatus);
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
    }, 2800);
  };

  const isStatusChanged = selectedStatus !== job.status;
  const isJobDueToday = isDueToday(job.dueDate) && job.status !== "Completed";
  const isJobOverdue = isOverdue(job.dueDate) && job.status !== "Completed";

  return (
    <Dialog.Content
      id="job-detail-drawer"
      className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200 focus:outline-none"
    >
      {/* Drawer Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-slate-900 bg-slate-200 px-2 py-0.5 rounded border border-slate-300">
              {job.jobId}
            </span>
            <span className="text-xs text-slate-500 font-medium">Work Order Details</span>
          </div>
          <Dialog.Title className="text-lg font-bold text-slate-900 mt-1">
            {job.productName}
          </Dialog.Title>
        </div>
        <Dialog.Close asChild>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-md transition-colors"
            aria-label="Close detail drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </Dialog.Close>
      </div>

      {/* Drawer Body - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {/* Status Feedback Alert */}
        {showConfirmation && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3.5 py-2.5 rounded-md flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Job status successfully updated to <strong>{job.status}</strong>.</span>
          </div>
        )}

        {/* Current Status Banner */}
        <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Current Status
          </span>
          <StatusBadge status={job.status} />
        </div>

        {/* Section: Job Information */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            Job Information
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" />
                Customer
              </div>
              <div className="font-medium text-slate-900 mt-0.5">{job.customer}</div>
            </div>

            <div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <Package className="w-3 h-3 text-slate-400" />
                Quantity
              </div>
              <div className="font-medium text-slate-900 mt-0.5">
                {job.quantity.toLocaleString()} units
              </div>
            </div>

            <div className="col-span-2">
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                Due Date
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-medium text-slate-900">
                  {formatDisplayDate(job.dueDate)}
                </span>
                {isJobDueToday && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                    Due Today
                  </span>
                )}
                {isJobOverdue && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                    Overdue
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section: Machine Assignment */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-1 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
            Machine Assignment
          </h4>
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md border border-slate-200">
            <div>
              <div className="text-xs text-slate-500">Allocated Machine</div>
              <div className="font-mono font-semibold text-slate-900 text-sm mt-0.5">
                {job.assignedMachine}
              </div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
              Assigned
            </span>
          </div>
        </div>

        {/* Section: Notes & Issues */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-1 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
            Notes & Operational Issues
          </h4>
          <div className="p-3 bg-amber-50/40 rounded-md border border-amber-200/70 text-xs text-slate-700 leading-relaxed">
            {job.notes ? (
              <p>{job.notes}</p>
            ) : (
              <p className="text-slate-400 italic">No operational issues recorded for this work order.</p>
            )}
          </div>
        </div>

        {/* Section: Status Update Workflow */}
        <div className="pt-2">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
            <div>
              <label
                htmlFor="update-status-select"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
              >
                Update Job Status
              </label>
              <p className="text-xs text-slate-500 mt-0.5">
                Modify the operational state of this work order.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <select
                id="update-status-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as JobStatus)}
                className="flex-1 px-3 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Delayed">Delayed</option>
                <option value="Completed">Completed</option>
              </select>

              <button
                id="confirm-update-status-button"
                type="button"
                onClick={handleUpdate}
                disabled={!isStatusChanged}
                className={cn(
                  "px-4 py-2 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap",
                  isStatusChanged
                    ? "bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shadow-2xs"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                )}
              >
                <span>Update Status</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {isStatusChanged && (
              <p className="text-[11px] text-amber-700 font-medium">
                * Status will change from <strong>{job.status}</strong> to <strong>{selectedStatus}</strong> upon confirmation.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Drawer Footer */}
      <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-md border border-slate-300 transition-colors"
        >
          Close Drawer
        </button>
      </div>
    </Dialog.Content>
  );
}

export function JobDetailSheet({
  job,
  isOpen,
  onClose,
  onUpdateStatus,
}: JobDetailSheetProps) {
  if (!job) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        {/* Backdrop Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 animate-in fade-in duration-200" />

        {/* Slide-out Drawer with key to reset state cleanly on job switch */}
        <JobDetailPanelContent
          key={job.id}
          job={job}
          onClose={onClose}
          onUpdateStatus={onUpdateStatus}
        />
      </Dialog.Portal>
    </Dialog.Root>
  );
}
