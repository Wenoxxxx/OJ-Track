// src/components/dashboard/recent-projects.tsx
import { useRecentProjects } from "@/hooks/useDashboard";
import type { DesignStatus, PaymentStatus } from "@/data/store";

const designBadge: Record<DesignStatus, string> = {
  "Not Started": "bg-rose-500/10 text-rose-500",
  Pending:       "bg-amber-500/10 text-amber-600",
  Done:          "bg-emerald-500/10 text-emerald-600",
};

const payBadge: Record<PaymentStatus, string> = {
  "Not Paid": "bg-rose-500/10 text-rose-500",
  Partial:    "bg-amber-500/10 text-amber-600",
  Paid:       "bg-teal-500/10 text-teal-600",
};

export function RecentProjects() {
  const { data, loading, error } = useRecentProjects();

  return (
    <div className="border bg-card p-6">
      <h3 className="font-bold text-sm uppercase tracking-wide text-primary text-bold mb-4">
        Recent Projects
      </h3>

      {loading && (
        <div className="divide-y divide-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="py-3 flex items-center justify-between gap-4 animate-pulse">
              <div className="space-y-1.5 flex-1">
                <div className="h-3 bg-muted/40 rounded w-3/4" />
                <div className="h-2.5 bg-muted/40 rounded w-1/2" />
              </div>
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-muted/40 rounded" />
                <div className="h-5 w-12 bg-muted/40 rounded" />
                <div className="h-5 w-16 bg-muted/40 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="text-sm text-rose-500">{error}</p>
      )}

      {!loading && !error && (
        <div className="divide-y divide-border">
          {data.map((c) => (
            <div key={c.id} className="py-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-medium text-sm truncate">{c.projectName}</p>
                <p className="text-xs text-muted-foreground">{c.clientName} · {c.projectType}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[11px] px-2 py-0.5 font-medium ${designBadge[c.designStatus as DesignStatus]}`}>
                  {c.designStatus}
                </span>
                <span className={`text-[11px] px-2 py-0.5 font-medium ${payBadge[c.paymentStatus as PaymentStatus]}`}>
                  {c.paymentStatus}
                </span>
                <span className="text-sm font-semibold tabular-nums">₱{c.rateAmount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
