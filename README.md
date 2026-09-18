# Production Control Dashboard

A high-clarity, enterprise-grade factory operations management frontend designed for manufacturing Operations Managers. The dashboard enables real-time monitoring of plant work orders, quick identification of delayed or upcoming jobs, inspection of machine assignments and operational notes, and seamless in-place job status updates.

---

## Features

- **Production Work Orders Table**: Compact, readable data table displaying Job ID, Product Name, Customer, Quantity, Due Date (with "Today" and "Overdue" visual badges), Status badges, and Assigned Machine.
- **Immediate Cross-Field Search**: Real-time, case-insensitive search matching against Job IDs, product names, and customer names with instant clearing.
- **Status Filtering**: Filter orders by operational status (`Pending`, `In Progress`, `Delayed`, `Completed`, or `All Statuses`).
- **Multi-Field Sorting**: Toggle sorting by Due Date (earliest/latest first) or Quantity (high-to-low/low-to-high) with visual direction indicators.
- **Slide-Over Job Detail Drawer**: Accessible, right-aligned modal sheet (built on Radix Dialog primitives) presenting complete work order specifications, machine allocations, and operational issue logs.
- **In-Place Status Updates**: Operations Managers can update any job's status directly within the drawer, immediately updating the drawer view, the data table row, and the summary metric counts without page reload.
- **Dynamic Derived Metrics**: Four top-level metric cards (`Total Jobs`, `Delayed Jobs`, `Jobs Due Today / Soon`, `Completed Jobs`) computed directly from active state.
- **Empty State & Filter Reset**: Informative empty state with a single-click "Clear filters" action when queries yield zero matches.
- **Responsive Layout**: Designed primarily for desktop operations workflow while fully adapting to laptops, tablets, and mobile devices.

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Primitives**: `@radix-ui/react-dialog` (accessible modal sheet), `clsx`, `tailwind-merge`
- **Icons**: [lucide-react](https://lucide.dev/)

---

## Getting Started

### 1. Prerequisites
Ensure you have **Node.js 18+** and **npm** installed.

### 2. Installation
Clone or navigate to the project directory and install dependencies:
```bash
npm install
```

### 3. Running the Development Server
Start the Next.js development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser to view the application.

### 4. Production Build
To create an optimized production build:
```bash
npm run build
npm run start
```

---

## Architecture

The project emphasizes separation of concerns, derived state, and modular component design:

```
├── app/
│   ├── globals.css           # Industrial enterprise theme and CSS design tokens
│   ├── layout.tsx            # Root layout with fonts, metadata, and body container
│   └── page.tsx              # Application shell containing DashboardHeader and main view
├── components/
│   ├── dashboard-header.tsx  # Application navigation, line operational status, and user indicator
│   ├── page-header.tsx       # Page title, operational subtitle, and last updated indicator
│   ├── production-dashboard.tsx # Master state coordinator managing data pipeline & derived metrics
│   ├── summary-cards.tsx     # Responsive grid of 4 operational metric cards
│   ├── summary-card.tsx      # Individual metric card component with status color accents
│   ├── job-filters.tsx       # Search bar, status select filter, sort dropdown, and active tags
│   ├── jobs-table.tsx        # Work orders data table with sortable columns and click-to-inspect
│   ├── status-badge.tsx      # Standardized semantic badges (Pending, In Progress, Delayed, Completed)
│   ├── job-detail-sheet.tsx  # Right-side drawer for inspecting job details and updating status
│   └── empty-state.tsx       # Fallback UI with filter reset action when no rows match
├── data/
│   └── mock-jobs.ts          # Realistic manufacturing work order dataset (16 jobs)
├── lib/
│   ├── date-utils.ts         # Centralized date comparison, formatters ("18 Sep 2026"), and due-soon logic
│   └── utils.ts              # Class name merger (`cn`) utilizing clsx and tailwind-merge
├── scripts/
│   └── test-dashboard.mjs    # Automated verification test suite for data transformations
└── types/
    └── job.ts                # TypeScript interfaces for Job, JobStatus, Sort, and Metrics
```

---

## Data

The application uses local mock data (`data/mock-jobs.ts`) representing 16 realistic manufacturing work orders with realistic industrial components (Motor Housing, Steel Bracket, Gear Assembly, Aluminum Panel, Valve Body, Turbine Impeller), industrial machinery (CNC mills, presses, lathes, assembly lines), and actual operational notes explaining root causes for delayed runs.

---

## Assumptions

1. **Client-Side State**: Status changes are stored in local React state for immediate reactivity during the user session; updates are not persisted to a remote database upon page refresh.
2. **"Due Soon" Definition**: Defined as work orders whose due date falls on today or within the next 2 calendar days (September 18 – September 20, 2026) that are not yet marked `Completed`.
3. **Metrics Scope**: Summary metrics reflect the entire active dataset rather than the currently filtered table view, providing the Operations Manager with plant-wide visibility at all times.

---

## Future Improvements

- **Backend / API Integration**: Connect to an ERP or MES (Manufacturing Execution System) REST or GraphQL API for persistent state and multi-user synchronization.
- **Role-Based Access Control**: Granular permissions (e.g. Operations Manager can reassign machines and change status; Machine Operator can only log progress notes).
- **Machine Health & Telemetry**: Expand machine badges into live telemetry modals showing spindle speed, vibration, and temperature sensors.
- **Audit Log & History**: Record timestamps and manager IDs for every status change and operational note appended.
- **Pagination / Virtualization**: Add server-side pagination or windowed virtualization to efficiently handle tens of thousands of historical work orders.
- **Real-Time WebSockets**: Live status broadcasts across shifts without manual page refresh.
