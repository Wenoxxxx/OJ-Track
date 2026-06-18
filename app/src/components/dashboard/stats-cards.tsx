import { getStats } from "@/data/store";
import {
  DollarSign,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Hourglass,
  Banknote,
  BadgeCheck,
} from "lucide-react";

const statConfig = [
  {
    key: "totalSales" as const,
    label: "Total Revenue",
    icon: DollarSign,
    format: (v: number) => `₱${v.toLocaleString()}`,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    key: "totalClients" as const,
    label: "Total Clients",
    icon: Users,
    format: (v: number) => `${v}`,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    key: "notStarted" as const,
    label: "Not Started",
    icon: AlertCircle,
    format: (v: number) => `${v} projects`,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    key: "pending" as const,
    label: "In Progress",
    icon: Hourglass,
    format: (v: number) => `${v} projects`,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    key: "done" as const,
    label: "Completed",
    icon: CheckCircle2,
    format: (v: number) => `${v} projects`,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    key: "payNotPaid" as const,
    label: "Unpaid",
    icon: Clock,
    format: (v: number) => `${v} clients`,
    color: "text-rose-400",
    bg: "bg-rose-400/10",
  },
  {
    key: "payPartial" as const,
    label: "Partial Payment",
    icon: Banknote,
    format: (v: number) => `${v} clients`,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  {
    key: "payPaid" as const,
    label: "Fully Paid",
    icon: BadgeCheck,
    format: (v: number) => `${v} clients`,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
  },
];

export function StatsCards() {
  const stats = getStats();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statConfig.map(({ key, label, icon: Icon, format, color, bg }) => (
        <div
          key={key}
          className="border bg-card p-5 flex items-start gap-4"
        >
          <div className={`p-2 ${bg}`}>
            <Icon size={18} className={color} />
          </div>
          <div>
            <p className="font-bold text-xs uppercase tracking-wide text-primary">{label}</p>
            <p className="mt-1 text-2xl font-bold">{format(stats[key])}</p>
          </div>
        </div>
      ))}
    </div>
  );
}