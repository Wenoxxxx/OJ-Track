import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { useReportStats, useMonthlySales, useSalesByType } from "@/hooks/useReports";
import type { DesignStatus, PaymentStatus } from "@/data/store";
import { SummaryKPIs } from "@/components/reports/summary-kpis";
import { MonthlySalesChart } from "@/components/reports/monthly-sales-chart";
import { DesignStatusPie } from "@/components/reports/design-status-pie";
import { SalesByTypeChart } from "@/components/reports/sales-by-type-chart";
import { PaymentStatusPie } from "@/components/reports/payment-status-pie";
import { designColors, payColors } from "@/components/reports/colors";

export default function ReportsPage() {
  const { data: stats,   loading: sLoad, error: sErr } = useReportStats();
  const { data: monthly, loading: mLoad, error: mErr } = useMonthlySales();
  const { data: byType,  loading: tLoad, error: tErr } = useSalesByType();

  const designPieData = stats
    ? (["Not Started", "Pending", "Done"] as DesignStatus[]).map((name) => ({
        name,
        value: name === "Not Started" ? stats.notStarted : name === "Pending" ? stats.pending : stats.done,
        color: designColors[name],
      }))
    : [];

  const payPieData = stats
    ? (["Not Paid", "Partial", "Paid"] as PaymentStatus[]).map((name) => ({
        name,
        value: name === "Not Paid" ? stats.payNotPaid : name === "Partial" ? stats.payPartial : stats.payPaid,
        color: payColors[name],
      }))
    : [];

  const summaryKPIs = stats
    ? [
        { label: "Total Projects",      value: stats.totalClients },
        { label: "Total Sales",         value: `₱${stats.totalSales.toLocaleString()}` },
        { label: "Avg. Rate / Project", value: `₱${Math.round(stats.totalSales / (stats.totalClients || 1)).toLocaleString()}` },
        { label: "Total Revisions",     value: stats.totalRevisions },
      ]
    : [];

  return (
    <>
      <DashboardHeader title="Reports" />

      <main className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <SummaryKPIs kpis={summaryKPIs} loading={sLoad} error={sErr} />

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          <MonthlySalesChart data={monthly} loading={mLoad} error={mErr} />
          <DesignStatusPie data={designPieData} loading={sLoad} />
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          <SalesByTypeChart data={byType} loading={tLoad} error={tErr} />
          <PaymentStatusPie data={payPieData} loading={sLoad} />
        </div>
      </main>
    </>
  );
}