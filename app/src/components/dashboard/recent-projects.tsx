import { clients } from "@/data/store";
import type { DesignStatus, PaymentStatus } from "@/data/store";

const recentClients = [...clients]
  .sort((a, b) => new Date(b.dateNegotiated).getTime() - new Date(a.dateNegotiated).getTime())
  .slice(0, 5);

const designBadge: Record<DesignStatus, string> = {
  "Not Started": "bg-rose-500/10 text-rose-500",
  Pending: "bg-amber-500/10 text-amber-600",
  Done: "bg-emerald-500/10 text-emerald-600",
};

const payBadge: Record<PaymentStatus, string> = {
  "Not Paid": "bg-rose-500/10 text-rose-500",
  Partial: "bg-amber-500/10 text-amber-600",
  Paid: "bg-teal-500/10 text-teal-600",
};

export function RecentProjects() {
  return (
    <div className="border bg-card p-6">
      <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground mb-4">
        Recent Projects
      </h3>

      <div className="divide-y divide-border">
        {recentClients.map((c) => (
          <div key={c.id} className="py-3 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{c.projectName}</p>
              <p className="text-xs text-muted-foreground">{c.clientName} · {c.projectType}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-[11px] px-2 py-0.5 font-medium ${designBadge[c.designStatus]}`}>
                {c.designStatus}
              </span>
              <span className={`text-[11px] px-2 py-0.5 font-medium ${payBadge[c.paymentStatus]}`}>
                {c.paymentStatus}
              </span>
              <span className="text-sm font-semibold tabular-nums">₱{c.rateAmount.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
