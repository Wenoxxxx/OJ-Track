import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Skeleton } from "./skeleton";

interface DesignStatusPieProps {
  data: { name: string; value: number; color: string }[];
  loading: boolean;
}

export function DesignStatusPie({ data, loading }: DesignStatusPieProps) {
  return (
    <div className="border bg-card p-6">
      <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">
        Design Status
      </h3>
      {loading ? (
        <Skeleton className="w-full h-[240px]" />
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="45%" innerRadius={55} outerRadius={80} paddingAngle={3}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}