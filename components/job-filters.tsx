import React from "react";
import { Search, X, ArrowUpDown, Filter } from "lucide-react";
import { SortDirection, SortField, StatusFilter } from "@/types/job";

interface JobFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedStatus: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField, direction: SortDirection) => void;
  onClearFilters: () => void;
  totalFiltered: number;
  totalAll: number;
}

export function JobFilters({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  sortField,
  sortDirection,
  onSortChange,
  onClearFilters,
  totalFiltered,
  totalAll,
}: JobFiltersProps) {
  const isFiltered = searchQuery.trim() !== "" || selectedStatus !== "All";

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3 sm:p-4 shadow-2xs space-y-3">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <label htmlFor="job-search-input" className="sr-only">
            Search jobs, products, or customers
          </label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" aria-hidden="true" />
          </div>
          <input
            id="job-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search jobs, products, or customers..."
            className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 rounded-md placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
              aria-label="Clear search text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter and Sort Controls */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          {/* Status Filter */}
          <div className="relative flex-1 sm:flex-initial min-w-[150px]">
            <label htmlFor="status-filter-select" className="sr-only">
              Filter by status
            </label>
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
              <Filter className="w-3.5 h-3.5" aria-hidden="true" />
            </div>
            <select
              id="status-filter-select"
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
              className="w-full pl-8 pr-7 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent cursor-pointer font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Delayed">Delayed</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Sort Control */}
          <div className="relative flex-1 sm:flex-initial min-w-[170px]">
            <label htmlFor="sort-select" className="sr-only">
              Sort jobs
            </label>
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
              <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
            </div>
            <select
              id="sort-select"
              value={`${sortField}-${sortDirection}`}
              onChange={(e) => {
                const [f, d] = e.target.value.split("-") as [SortField, SortDirection];
                onSortChange(f, d);
              }}
              className="w-full pl-8 pr-7 py-2 text-sm bg-white border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent cursor-pointer font-medium"
            >
              <option value="dueDate-asc">Due Date: Earliest First</option>
              <option value="dueDate-desc">Due Date: Latest First</option>
              <option value="quantity-desc">Quantity: High to Low</option>
              <option value="quantity-asc">Quantity: Low to High</option>
            </select>
          </div>

          {/* Clear Filters Button if any filters active */}
          {isFiltered && (
            <button
              id="clear-filters-button"
              type="button"
              onClick={onClearFilters}
              className="px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md border border-slate-300 transition-colors whitespace-nowrap"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Scannable Results Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
        <div>
          Showing <span className="font-semibold text-slate-800">{totalFiltered}</span> of{" "}
          <span className="font-semibold text-slate-800">{totalAll}</span> work orders
          {selectedStatus !== "All" && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
              Filtered: {selectedStatus}
            </span>
          )}
          {searchQuery && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
              Query: &ldquo;{searchQuery}&rdquo;
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
