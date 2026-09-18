# Production Control Dashboard

## Overview

The **Production Control Dashboard** is an enterprise factory operations management application built for manufacturing Operations Managers. It provides a real-time operational interface to monitor factory work orders, identify delayed jobs and approaching delivery deadlines, inspect machine assignments and operational notes, and perform in-place job status updates.

---

## Features

- **Production Work Orders Monitoring**: Scannable tabular presentation of manufacturing runs with status indicators, quantities, and machine allocations.
- **Top-Level Operational Metrics**: Real-time summary cards derived dynamically from active job data.
- **Immediate Multi-Field Search**: Substring filtering across Job IDs, product descriptions, and client accounts.
- **Status Filtering**: Filter view by operational phases (`Pending`, `In Progress`, `Delayed`, `Completed`).
- **Bi-Directional Sorting**: Sort by delivery schedule or order quantity in ascending or descending order.
- **Slide-Over Detail Drawer**: Right-aligned inspection panel showing comprehensive job parameters, machine allocations, and operational issue logs.
- **Interactive Status Transition**: Change job states directly within the drawer with live propagation across metrics, table rows, and active filters.
- **Empty State with Filter Reset**: Dedicated zero-match fallback view with one-click filter clearing.
- **Responsive Interface**: Structured for high-density desktop monitoring while adapting fluidly to laptops, tablets, and mobile devices.

---

## Production Summary

The dashboard displays four summary cards at the top of the interface. These values are computed dynamically from active state:

- **Total Jobs**: Total work orders tracked across all plant floors (16 total).
- **Delayed Jobs**: Active orders currently flagged with delays requiring intervention (accented with an alert border and badge).
- **Due Today / Soon**: Work orders scheduled for delivery today or within the next two calendar days that have not yet finished.
- **Completed Jobs**: Total jobs that have completed fabrication, quality inspection, and packaging.

---

## Work Orders Table

The work orders table presents production runs in a scannable format optimized for quick assessment by plant managers.

| Field | Description |
|---|---|
| **Job ID** | Unique work order tracking identifier (e.g., `JOB-101`, `JOB-102`) rendered in monospace. |
| **Product** | Manufactured component name (e.g., `Motor Housing`, `Steel Bracket`, `Turbine Impeller`). |
| **Customer** | Ordering company or industrial client (e.g., `Sterling Motors`, `Acme Manufacturing`). |
| **Quantity** | Total units in production run, formatted with standard comma delimiters (e.g., `1,200`). |
| **Due Date** | Scheduled delivery date formatted as `DD Mon YYYY` with relative badges (`Today`, `Overdue`). |
| **Status** | Current operational stage displayed with semantic color-coded status badges. |
| **Assigned Machine** | Equipment assigned to the job (e.g., `CNC-01`, `Press-01`, `Lathe-01`, `Mill-01`). |

---

## Search

The search input provides immediate filtering without requiring form submission:

- Matches across **Job ID**, **Product Name**, and **Customer Name**.
- Operates case-insensitively (e.g., searching `acme`, `motor`, or `job-104` returns corresponding matches).
- Includes an instant clear button (`X`) within the input to restore all records with a single click.

---

## Filtering

A dedicated status dropdown allows managers to narrow the active table view:

- **All Statuses**: Shows all work orders regardless of current state.
- **Pending**: Shows staged jobs awaiting raw materials or machine changeovers.
- **In Progress**: Shows active jobs currently running on machines or assembly lines.
- **Delayed**: Shows blocked jobs requiring supervisor attention.
- **Completed**: Shows finished runs that have passed inspection and packaging.

Summary metrics remain calculated against the global dataset so plant managers maintain total operational awareness regardless of active table filtering.

---

## Sorting

Users can sort the work order dataset by clicking the table column headers or using the sort dropdown:

- **Due Date (Ascending)**: Orders jobs from earliest deadline to latest.
- **Due Date (Descending)**: Orders jobs from furthest deadline to earliest.
- **Quantity (Descending)**: Orders jobs from highest unit count to lowest.
- **Quantity (Ascending)**: Orders jobs from lowest unit count to highest.

Sorting operates in harmony with active search queries and status filters.

---

## Job Details

Clicking any row in the work orders table opens an accessible right-side slide-over drawer powered by Radix Dialog primitives.

The drawer presents:

- **Header**: Job ID badge, title, and work order header.
- **Job Information**: Customer account, ordered unit quantity, and formatted delivery deadline with relative schedule alerts.
- **Machine Assignment**: Allocated machine station and assignment verification.
- **Notes & Issues**: Operational logs documenting root causes for delays (e.g., spindle vibrations, tolerance check holds, supplier delays).

---

## Status Updates

The detail drawer features an in-place status management workflow:

1. The manager selects a new status from the dropdown (`Pending`, `In Progress`, `Delayed`, `Completed`).
2. The "Update Status" button becomes active and displays an explanatory prompt indicating the pending change.
3. Clicking "Update Status" commits the transition to local React state.
4. An immediate confirmation alert appears in the drawer.
5. The drawer status badge, table row badge, and summary metrics update in real time without a page refresh.

---

## Empty States

When search terms or status filters match zero records:

- An empty state card is displayed in place of empty table rows.
- Clear messaging communicates that no work orders match the current criteria.
- A "Clear filters" button is provided to reset all active queries and filters in a single action.

---

## Responsive Design

The application is structured for desktop operations workflows while adapting to various screen dimensions:

- **Desktop (1280px+)**: 4-column metric cards, inline filter controls, full-width data table, right-side detail drawer (480px width).
- **Tablet (768px – 1024px)**: 2-column metric cards, wrapping filter bar, horizontally scrollable table container preventing content clipping.
- **Mobile (375px – 640px)**: 1-column stacked metric cards, full-width inputs, and a full-viewport detail drawer with accessible touch targets.

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 16 (App Router, Turbopack)
- **UI Library**: [React](https://react.dev/) 19
- **Language**: [TypeScript](https://www.typescriptlang.org/) 5
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **UI Primitives**: `@radix-ui/react-dialog` (accessible modal sheet), `clsx`, `tailwind-merge`
- **Icons**: [lucide-react](https://lucide.dev/)

---

## Project Structure

```
├── app/
│   ├── globals.css              # Industrial theme variables and Tailwind styling
│   ├── layout.tsx               # Root application layout and typography setup
│   └── page.tsx                 # Main dashboard page
├── components/
│   ├── dashboard-header.tsx     # Operations brand header and user profile indicator
│   ├── empty-state.tsx          # Zero-results feedback card with reset action
│   ├── job-detail-sheet.tsx     # Slide-over drawer with status update workflow
│   ├── job-filters.tsx          # Search bar, status select, and sorting controls
│   ├── jobs-table.tsx           # Work orders data table with sortable columns
│   ├── page-header.tsx          # Dashboard title, subtitle, and last-updated tag
│   ├── production-dashboard.tsx # Master coordinator managing data flow & derived state
│   ├── status-badge.tsx         # Standardized semantic badges for work order statuses
│   ├── summary-card.tsx         # Individual metric card component
│   └── summary-cards.tsx        # Grid container for the 4 summary metrics
├── data/
│   └── mock-jobs.ts             # 16 realistic manufacturing work orders
├── lib/
│   ├── date-utils.ts            # Date formatting and comparison utilities
│   └── utils.ts                 # Class merger utility (`cn`)
├── scripts/
│   └── test-dashboard.mjs       # Automated test suite validating data transformations
└── types/
    └── job.ts                   # TypeScript interfaces for jobs, statuses, and metrics
```

---

## Component Architecture

- **`ProductionDashboard`**: Acts as the central state coordinator. Holds raw work order state, search text, active status filter, sort field, sort direction, and selected job ID. Computes derived metrics and filtered lists via `useMemo`.
- **`JobsTable`**: Renders rows with keyboard access (`Enter`, `Space`) and click handlers to open job details.
- **`JobDetailSheet`**: Houses `JobDetailPanelContent`, keyed by `job.id` to ensure form state and confirmation banners reset cleanly when switching between work orders.
- **`StatusBadge`**: Pure presentation component applying semantic background, border, and text colors corresponding to job status.

---

## State Management

State is managed using native React hooks without third-party global state libraries:

- **Immutable Data Pipeline**: `jobs` &rarr; `searchQuery` &rarr; `selectedStatus` &rarr; `sortField / sortDirection` &rarr; `filteredAndSortedJobs`.
- **Global Metrics Isolation**: Metrics (`totalJobs`, `delayedJobs`, `dueSoonJobs`, `completedJobs`) derive directly from the complete `jobs` array so table filtering does not skew plant-wide operational figures.
- **Status Updates**: The `handleUpdateStatus` callback updates the target record immutably in state, causing dependent derivations to recompute synchronously.

---

## Data

The application includes 16 realistic manufacturing work orders defined in `data/mock-jobs.ts`. The dataset models actual factory operations:

- **Components**: Motor Housing, Steel Bracket, Gear Assembly, Aluminum Panel, Pump Cover, Drive Shaft, Valve Body, Control Enclosure, Bearing Mount, Hydraulic Coupling, Conveyor Roller, Precision Shaft, Flange Adapter, Piston Ring Set, Turbine Impeller, Exhaust Manifold.
- **Machines**: CNC-01, CNC-02, CNC-03, Press-01, Press-02, Assembly-01, Assembly-02, Lathe-01, Mill-01.
- **Clients**: Sterling Motors, Acme Manufacturing, Apex Components, Nova Industries, Meridian Systems, Orion Industrial, Vertex Engineering.
- **Operational Notes**: Concrete manufacturing logs detailing spindle vibrations, CMM inspections, tooling changeovers, anodizing delays, and quality checks.

---

## Assumptions

1. **Client-Side Session State**: Work order status changes persist within the active browser session; data is reset to initial mock records upon page reload.
2. **"Due Soon" Definition**: Defined as uncompleted jobs whose due date falls on the reference date or within the next two calendar days (September 18 – September 20, 2026).
3. **Plant-Wide Metric Visibility**: Metrics represent the entire work order portfolio rather than the filtered table slice, ensuring continuous operational visibility.

---

## Getting Started

### Prerequisites

- **Node.js**: Version 18.17 or higher
- **npm**: Version 9 or higher

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

### Running Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## Available Scripts

The following scripts are defined in `package.json`:

```bash
# Start the local development server with Turbopack
npm run dev

# Compile TypeScript and build the production bundle
npm run build

# Start the production server after building
npm run start

# Run ESLint to verify code quality and React conventions
npm run lint

# Run TypeScript compiler to check for type errors without emitting files
npm run typecheck
```

To run the automated business logic test suite:

```bash
npx tsx scripts/test-dashboard.mjs
```

---

## Validation

The codebase has undergone verification across multiple dimensions:

- **TypeScript Typecheck**: `npm run typecheck` passes with zero errors.
- **ESLint Code Quality**: `npm run lint` passes with zero errors and zero warnings.
- **Production Compilation**: `npm run build` compiles with zero warnings, generating optimized static routes.
- **Logic & Transition Test Suite**: `npx tsx scripts/test-dashboard.mjs` executes 41 automated assertions validating initial metric derivations, single and combined search/filter/sort pipelines, status mutations, and date calculations.

---

## Future Improvements

- **Backend & Database Integration**: Connect to an ERP or MES (Manufacturing Execution System) PostgreSQL database via a REST or GraphQL API for persistent record keeping.
- **Role-Based Permissions**: Restrict status modifications to certified floor supervisors and line managers.
- **Machine Telemetry Modals**: Integrate real-time vibration, temperature, and cycle time feeds for assigned machines.
- **Audit Trails**: Maintain an immutable changelog of status changes with timestamps and operator IDs.
- **Pagination & Virtual Scrolling**: Support factory deployments tracking tens of thousands of historical work orders.

---

## Assignment Scope

This application was engineered as a focused Front-End Engineer assignment for **BuildForms.so**, demonstrating practical React component architecture, clean state handling, enterprise design aesthetics, and robust TypeScript discipline without extraneous dependencies.
