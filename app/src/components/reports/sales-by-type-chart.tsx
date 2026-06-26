import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "./skeleton";

interface SalesByTypeChartProps {
  data: { type: string; sales: number }[];
  loading: boolean;
  error?: string | null;
}

export function SalesByTypeChart({ data, loading, error }: SalesByTypeChartProps) {
  return (
    <div className="border bg-card p-6">
      <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">
        Sales by Project Type
      </h3>
      {loading ? (
        <Skeleton className="w-full h-[220px]" />
      ) : error ? (
        <p className="text-sm text-rose-500">{error}</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} layout="vertical">
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
  );
}