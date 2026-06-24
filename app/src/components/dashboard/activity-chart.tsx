// src/components/dashboard/activity-chart.tsx
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { useMonthlyActivity } from "@/hooks/useDashboard";

export function ActivityChart() {
  const { data, loading, error } = useMonthlyActivity();

  return (
    <div className="border bg-card p-6">
      <h3 className="font-bold text-sm uppercase tracking-wide text-primary mb-1">
        Monthly Activity
      </h3>
      <p className="text-xs text-muted-foreground mb-6">
        Number of clients & sales per month
      </p>

      {loading && (
        <div className="h-[260px] flex items-center justify-center">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )}

      {!loading && error && (
        <div className="h-[260px] flex items-center justify-center text-sm text-rose-500">
          {error}
        </div>
      )}

      {!loading && !error && (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} barGap={6}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis
              yAxisId="clients"
              orientation="left"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              label={{ value: "Clients", angle: -90, position: "insideLeft", fontSize: 11, offset: 10 }}
            />
            <YAxis
              yAxisId="sales"
              orientation="right"
              tick={{ fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: number, name: string) =>
                name === "sales" ? [`₱${value.toLocaleString()}`, "Sales"] : [value, "Clients"]
              }
              contentStyle={{
                fontSize: 12,
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--card))",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar yAxisId="clients" dataKey="clients" name="Clients" fill="hsl(220 80% 55%)" maxBarSize={36} />
            <Bar yAxisId="sales"   dataKey="sales"   name="Sales"   fill="hsl(150 60% 45%)" maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
