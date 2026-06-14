import DashboardLayout from "@/layouts/dashboard-layout";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { clients, monthlyClients, getStats } from "@/data/store";
import type { DesignStatus, PaymentStatus } from "@/data/store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const stats = getStats();

const summaryKPIs = [
  { label: "Total Projects", value: stats.totalClients },
  { label: "Total Sales", value: `₱${stats.totalSales.toLocaleString()}` },
  { label: "Avg. Rate / Project", value: `₱${Math.round(stats.totalSales / stats.totalClients).toLocaleString()}` },
  {
    label: "Total Revisions",
    value: clients.reduce((s, c) => s + c.revisionCount, 0),
  },
];

const designPieData: { name: DesignStatus; value: number; color: string }[] = [
  { name: "Not Started", value: stats.notStarted, color: "#f43f5e" },
  { name: "Pending", value: stats.pending, color: "#f59e0b" },
  { name: "Done", value: stats.done, color: "#10b981" },
];

const payPieData: { name: PaymentStatus; value: number; color: string }[] = [
  { name: "Not Paid", value: stats.payNotPaid, color: "#f43f5e" },
  { name: "Partial", value: stats.payPartial, color: "#f59e0b" },
  { name: "Paid", value: stats.payPaid, color: "#14b8a6" },
];

// Sales by project type
const salesByType = Object.entries(
  clients.reduce<Record<string, number>>((acc, c) => {
    acc[c.projectType] = (acc[c.projectType] ?? 0) + c.rateAmount;
    return acc;
  }, {})
).map(([type, sales]) => ({ type, sales }))
  .sort((a, b) => b.sales - a.sales);

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <DashboardHeader title="Reports" />

      <main className="p-6 space-y-6">
        {/* Summary KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryKPIs.map((kpi) => (
            <div key={kpi.label} className="border bg-card p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{kpi.label}</p>
              <p className="mt-1 text-3xl font-bold">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Monthly Sales Bar */}
          <div className="lg:col-span-2 border bg-card p-6">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">
              Monthly Sales (₱)
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyClients}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(v: number) => [`₱${v.toLocaleString()}`, "Sales"]}
                  contentStyle={{
                    fontSize: 12,
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--card))",
                  }}
                />
                <Bar dataKey="sales" fill="hsl(220 80% 55%)" maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Design Status Pie */}
          <div className="border bg-card p-6">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">
              Design Status
            </h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={designPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {designPieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Sales by project type */}
          <div className="border bg-card p-6">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">
              Sales by Project Type
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={salesByType} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`}
                />
                <YAxis type="category" dataKey="type" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip
                  formatter={(v: number) => [`₱${v.toLocaleString()}`, "Sales"]}
                  contentStyle={{ fontSize: 12, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                />
                <Bar dataKey="sales" fill="hsl(150 60% 45%)" maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Payment Status Pie */}
          <div className="border bg-card p-6">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">
              Payment Status
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={payPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {payPieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>

            {/* Breakdown table */}
            <div className="mt-4 divide-y divide-border text-sm">
              {payPieData.map((d) => (
                <div key={d.name} className="flex justify-between py-2">
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="font-semibold">{d.value} clients</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
