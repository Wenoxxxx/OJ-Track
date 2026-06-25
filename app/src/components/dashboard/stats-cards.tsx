// src/components/dashboard/stats-cards.tsx
import { useDashboardStats } from "@/hooks/useDashboard";
import {
  DollarSign, Users, Clock, CheckCircle2,
  AlertCircle, Hourglass, Banknote, BadgeCheck,
} from "lucide-react";

const statConfig = [
  { key: "totalSales"   as const, label: "Total Revenue",    icon: DollarSign,  format: (v: number) => `₱${v.toLocaleString()}`,    color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { key: "totalClients" as const, label: "Total Clients",    icon: Users,        format: (v: number) => `${v}`,                       color: "text-blue-500",    bg: "bg-blue-500/10"    },
  { key: "notStarted"   as const, label: "Not Started",      icon: AlertCircle,  format: (v: number) => `${v} projects`,              color: "text-rose-500",    bg: "bg-rose-500/10"    },
  { key: "pending"      as const, label: "In Progress",      icon: Hourglass,    format: (v: number) => `${v} projects`,              color: "text-amber-500",   bg: "bg-amber-500/10"   },
  { key: "done"         as const, label: "Completed",        icon: CheckCircle2, format: (v: number) => `${v} projects`,              color: "text-green-500",   bg: "bg-green-500/10"   },
  { key: "payNotPaid"   as const, label: "Unpaid",           icon: Clock,        format: (v: number) => `${v} clients`,               color: "text-rose-400",    bg: "bg-rose-400/10"    },
  { key: "payPartial"   as const, label: "Partial Payment",  icon: Banknote,     format: (v: number) => `${v} clients`,               color: "text-amber-400",   bg: "bg-amber-400/10"   },
  { key: "payPaid"      as const, label: "Fully Paid",       icon: BadgeCheck,   format: (v: number) => `${v} clients`,               color: "text-teal-500",    bg: "bg-teal-500/10"    },
];

export function StatsCards() {
  const { data: stats, loading, error } = useDashboardStats();

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border bg-card p-3 sm:p-5 flex items-start gap-3 sm:gap-4 animate-pulse">
            <div className="p-1.5 sm:p-2 bg-muted/40 rounded w-7 h-7 sm:w-9 sm:h-9 shrink-0" />
            <div className="flex-1 space-y-2 pt-0.5 min-w-0">
              <div className="h-2 bg-muted/40 rounded w-2/3" />
              <div className="h-5 bg-muted/40 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="border bg-card p-5 text-sm text-rose-500">
        Failed to load stats: {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:gap-4 xl:grid-cols-4">
      {statConfig.map(({ key, label, icon: Icon, format, color, bg }) => (
        <div key={key} className="border bg-card p-3 sm:p-5 flex items-start gap-2.5 sm:gap-4">
          <div className={`p-1.5 sm:p-2 ${bg} shrink-0`}>
            <Icon size={15} className={`${color} sm:hidden`} />
            <Icon size={18} className={`${color} hidden sm:block`} />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[10px] sm:text-xs uppercase tracking-wide text-primary leading-tight">{label}</p>
            <p className="mt-0.5 sm:mt-1 text-lg sm:text-2xl font-bold truncate">{format(stats[key])}</p>
          </div>
        </div>
      ))}
    </div>
  );
}