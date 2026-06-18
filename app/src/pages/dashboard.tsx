import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { ActivityChart } from "@/components/dashboard/activity-chart";
import { RecentProjects } from "@/components/dashboard/recent-projects";

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader title="Dashboard" />

      <main className="p-6 pr-10 space-y-6">
        <StatsCards />

        <div className="grid gap-6 lg:grid-cols-2">
          <ActivityChart />
          <RecentProjects />
        </div>
      </main>
    </>
  );
}