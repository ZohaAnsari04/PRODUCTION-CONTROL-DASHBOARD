"use client";

import React, { useState, useMemo, useCallback } from "react";
import { INITIAL_JOBS } from "@/data/mock-jobs";
import { Job, JobStatus, SortDirection, SortField, StatusFilter, SummaryMetrics } from "@/types/job";
import { isDueSoon } from "@/lib/date-utils";
import { PageHeader } from "./page-header";
import { SummaryCards } from "./summary-cards";
import { JobFilters } from "./job-filters";
import { JobsTable } from "./jobs-table";
import { JobDetailSheet } from "./job-detail-sheet";

export function ProductionDashboard() {
  // Main state
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("All");
  const [sortField, setSortField] = useState<SortField>("dueDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Derived Summary Metrics calculated from the full dataset
  const metrics: SummaryMetrics = useMemo(() => {
    return {
      totalJobs: jobs.length,
      delayedJobs: jobs.filter((j) => j.status === "Delayed").length,
      dueSoonJobs: jobs.filter((j) => isDueSoon(j.dueDate) && j.status !== "Completed").length,
      completedJobs: jobs.filter((j) => j.status === "Completed").length,
    };
  }, [jobs]);

  // Derived filtered and sorted jobs for display in the table
  const filteredAndSortedJobs = useMemo(() => {
    let result = [...jobs];

    // 1. Search filter: case-insensitive match on Job ID, Product Name, Customer
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (job) =>
          job.jobId.toLowerCase().includes(q) ||
          job.productName.toLowerCase().includes(q) ||
          job.customer.toLowerCase().includes(q)
      );
    }

    // 2. Status filter
    if (selectedStatus !== "All") {
      result = result.filter((job) => job.status === selectedStatus);
    }

    // 3. Sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === "dueDate") {
        comparison = a.dueDate.localeCompare(b.dueDate);
      } else if (sortField === "quantity") {
        comparison = a.quantity - b.quantity;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [jobs, searchQuery, selectedStatus, sortField, sortDirection]);

  // Selected job object for drawer
  const selectedJob = useMemo(() => {
    return jobs.find((j) => j.id === selectedJobId) || null;
  }, [jobs, selectedJobId]);

  // Handler: Select job and open drawer
  const handleSelectJob = useCallback((jobId: string) => {
    setSelectedJobId(jobId);
    setIsDrawerOpen(true);
  }, []);

  // Handler: Close drawer
  const handleCloseDrawer = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  // Handler: Update job status
  const handleUpdateStatus = useCallback((jobId: string, newStatus: JobStatus) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => (job.id === jobId ? { ...job, status: newStatus } : job))
    );
  }, []);

  // Handler: Clear search & filters
  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedStatus("All");
    setSortField("dueDate");
    setSortDirection("asc");
  }, []);

  // Handler: Sort change
  const handleSortChange = useCallback((field: SortField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  }, []);

  const hasActiveFilters = searchQuery.trim() !== "" || selectedStatus !== "All";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader lastUpdated="18 Sep 2026, 21:45" />

      {/* Summary Metrics */}
      <section aria-labelledby="metrics-heading">
        <h2 id="metrics-heading" className="sr-only">
          Production Summary Metrics
        </h2>
        <SummaryCards metrics={metrics} />
      </section>

      {/* Filter and Table Section */}
      <section aria-labelledby="jobs-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="jobs-heading" className="text-base font-semibold text-slate-900">
            Work Orders
          </h2>
        </div>

        {/* Search, Filter & Sort Controls */}
        <JobFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          onClearFilters={handleClearFilters}
          totalFiltered={filteredAndSortedJobs.length}
          totalAll={jobs.length}
        />

        {/* Main Work Orders Table */}
        <JobsTable
          jobs={filteredAndSortedJobs}
          selectedJobId={selectedJobId}
          onSelectJob={handleSelectJob}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          onResetFilters={handleClearFilters}
          hasFilters={hasActiveFilters}
        />
      </section>

      {/* Job Detail Sheet / Drawer */}
      <JobDetailSheet
        job={selectedJob}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
