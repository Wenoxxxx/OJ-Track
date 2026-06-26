import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Skeleton } from "./skeleton";

interface PaymentStatusPieProps {
  data: { name: string; value: number; color: string }[];
  loading: boolean;
}

export function PaymentStatusPie({ data, loading }: PaymentStatusPieProps) {
  return (
    <div className="border bg-card p-6">
      <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">
        Payment Status
      </h3>
      {loading ? (
        <Skeleton className="w-full h-[220px]" />
      ) : (
        <>
          <ResponsiveContainer width="100%" height={220}>
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

          <div className="mt-4 divide-y divide-border text-sm">
            {data.map((d) => (
              <div key={d.name} className="flex justify-between py-2">
                <span className="text-muted-foreground">{d.name}</span>
                <span className="font-semibold">{d.value} clients</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}