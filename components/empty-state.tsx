import React from "react";
import { SearchX, RotateCcw } from "lucide-react";

interface EmptyStateProps {
  onReset: () => void;
  hasFilters: boolean;
}

export function EmptyState({ onReset, hasFilters }: EmptyStateProps) {
  return (
    <div className="py-16 px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
        <SearchX className="w-6 h-6" />
      </div>
      <h3 className="mt-3 text-base font-semibold text-slate-900">No jobs found</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
        No production work orders match your search query or status filter. Try adjusting your parameters.
      </p>
      {hasFilters && (
        <div className="mt-4">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md shadow-2xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
