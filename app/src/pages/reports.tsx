// src/pages/reports.tsx
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { useReportStats, useMonthlySales, useSalesByType } from "@/hooks/useReports";
import type { DesignStatus, PaymentStatus } from "@/data/store";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const designColors: Record<DesignStatus, string> = {
  "Not Started": "#f43f5e",
  Pending:       "#f59e0b",
  Done:          "#10b981",
};
const payColors: Record<PaymentStatus, string> = {
  "Not Paid": "#f43f5e",
  Partial:    "#f59e0b",
  Paid:       "#14b8a6",
};

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-muted/40 rounded ${className}`} />;
}

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
        { label: "Total Projects",     value: stats.totalClients },
        { label: "Total Sales",        value: `₱${stats.totalSales.toLocaleString()}` },
        { label: "Avg. Rate / Project",value: `₱${Math.round(stats.totalSales / (stats.totalClients || 1)).toLocaleString()}` },
        { label: "Total Revisions",    value: stats.totalRevisions },
      ]
    : [];

  return (
    <>
      <DashboardHeader title="Reports" />

      <main className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Summary KPIs */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 xl:grid-cols-4">
          {sLoad
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="border bg-card p-5">
                  <Skeleton className="h-2.5 w-2/3 mb-3" />
                  <Skeleton className="h-8 w-1/2" />
                </div>
              ))
            : sErr
            ? <div className="col-span-4 text-sm text-rose-500">Stats error: {sErr}</div>
            : summaryKPIs.map((kpi) => (
                <div key={kpi.label} className="border bg-card p-5">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">{kpi.label}</p>
                  <p className="mt-1 text-3xl font-bold">{kpi.value}</p>
                </div>
              ))
          }
        </div>

        {/* Charts row */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Monthly Sales Bar */}
          <div className="lg:col-span-2 border bg-card p-6">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">
              Monthly Sales (₱)
            </h3>
            {mLoad ? (
              <Skeleton className="w-full h-[240px]" />
            ) : mErr ? (
              <p className="text-sm text-rose-500">{mErr}</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(v) => [`₱${Number(v).toLocaleString()}`, "Sales"]}
                    contentStyle={{ fontSize: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                  />
                  <Bar dataKey="sales" fill="hsl(220 80% 55%)" maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Design Status Pie */}
          <div className="border bg-card p-6">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">
              Design Status
            </h3>
            {sLoad ? (
              <Skeleton className="w-full h-[240px]" />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={designPieData} dataKey="value" nameKey="name" cx="50%" cy="45%" innerRadius={55} outerRadius={80} paddingAngle={3}>
                    {designPieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Sales by project type */}
          <div className="border bg-card p-6">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">
              Sales by Project Type
            </h3>
            {tLoad ? (
              <Skeleton className="w-full h-[220px]" />
            ) : tErr ? (
              <p className="text-sm text-rose-500">{tErr}</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={byType} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="type" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip
                    formatter={(v) => [`₱${Number(v).toLocaleString()}`, "Sales"]}
                    contentStyle={{ fontSize: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                  />
                  <Bar dataKey="sales" fill="hsl(150 60% 45%)" maxBarSize={22} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Payment Status Pie */}
          <div className="border bg-card p-6">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">
              Payment Status
            </h3>
            {sLoad ? (
              <Skeleton className="w-full h-[220px]" />
            ) : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={payPieData} dataKey="value" nameKey="name" cx="50%" cy="45%" innerRadius={55} outerRadius={80} paddingAngle={3}>
                      {payPieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>

                <div className="mt-4 divide-y divide-border text-sm">
                  {payPieData.map((d) => (
                    <div key={d.name} className="flex justify-between py-2">
                      <span className="text-muted-foreground">{d.name}</span>
                      <span className="font-semibold">{d.value} clients</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
