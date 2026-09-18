import { DashboardHeader } from "@/components/dashboard-header";
import { ProductionDashboard } from "@/components/production-dashboard";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Application Branding & Header */}
      <DashboardHeader />

      {/* Main Operations Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ProductionDashboard />
      </main>

      {/* Operations Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Production Control System &bull; Factory Floor Division</span>
          <span>Internal Operations &bull; Plant 04</span>
        </div>
      </footer>
    </div>
  );
}
