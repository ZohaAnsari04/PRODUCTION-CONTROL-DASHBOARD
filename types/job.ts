export type JobStatus = "Pending" | "In Progress" | "Delayed" | "Completed";

export interface Job {
  id: string;
  jobId: string;
  productName: string;
  customer: string;
  quantity: number;
  dueDate: string; // ISO format string: YYYY-MM-DD
  status: JobStatus;
  assignedMachine: string;
  notes?: string;
}

export type SortField = "dueDate" | "quantity";
export type SortDirection = "asc" | "desc";
export type StatusFilter = "All" | JobStatus;

export interface SummaryMetrics {
  totalJobs: number;
  delayedJobs: number;
  dueSoonJobs: number;
  completedJobs: number;
}
