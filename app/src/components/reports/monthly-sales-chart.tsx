import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "./skeleton";

interface MonthlySalesChartProps {
  data: { month: string; sales: number }[];
  loading: boolean;
  error?: string | null;
}

export function MonthlySalesChart({ data, loading, error }: MonthlySalesChartProps) {
  return (
    <div className="lg:col-span-2 border bg-card p-6">
      <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">
        Monthly Sales (₱)
      </h3>
      {loading ? (
        <Skeleton className="w-full h-[240px]" />
      ) : error ? (
        <p className="text-sm text-rose-500">{error}</p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data}>
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
  );
}