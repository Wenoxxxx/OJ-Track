import { Skeleton } from "./skeleton";

interface KPI {
  label: string;
  value: string | number;
}

interface SummaryKPIsProps {
  kpis: KPI[];
  loading: boolean;
  error?: string | null;
}

export function SummaryKPIs({ kpis, loading, error }: SummaryKPIsProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 xl:grid-cols-4">
      {loading
        ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border bg-card p-5">
              <Skeleton className="h-2.5 w-2/3 mb-3" />
              <Skeleton className="h-8 w-1/2" />
            </div>
          ))
        : error
        ? <div className="col-span-4 text-sm text-rose-500">Stats error: {error}</div>
        : kpis.map((kpi) => (
            <div key={kpi.label} className="border bg-card p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{kpi.label}</p>
              <p className="mt-1 text-3xl font-bold">{kpi.value}</p>
            </div>
          ))
      }
    </div>
  );
}