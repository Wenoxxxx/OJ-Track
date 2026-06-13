import DashboardLayout from "@/layouts/dashboard-layout";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatsCards } from "@/components/dashboard/stats-cards";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <DashboardHeader />

      <main className="p-6">
        <StatsCards />
      </main>
    </DashboardLayout>
  );
}