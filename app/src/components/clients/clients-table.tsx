import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import type { Client, DesignStatus, PaymentStatus } from "@/data/store";
import type { SortKey, SortDir } from "./types";

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

const columns: { key: SortKey; label: string }[] = [
  { key: "projectName",    label: "Project Name" },
  { key: "clientName",     label: "Client"        },
  { key: "projectType",    label: "Type"          },
  { key: "rateAmount",     label: "Rate"          },
  { key: "revisionCount",  label: "Revisions"     },
  { key: "dateNegotiated", label: "Date"          },
  { key: "designStatus",   label: "Design Status" },
  { key: "paymentStatus",  label: "Payment"       },
];

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronsUpDown size={13} className="text-muted-foreground/50" />;
  return dir === "asc"
    ? <ChevronUp   size={13} className="text-foreground" />
    : <ChevronDown size={13} className="text-foreground" />;
}

interface ClientsTableProps {
  clients: Client[];
  loading: boolean;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
}

export function ClientsTable({ clients, loading, sortKey, sortDir, onSort }: ClientsTableProps) {
  return (
    <div className="border bg-card overflow-x-auto">
      <table className="w-full text-xs">
        <thead className="border-b bg-muted/40">
          <tr>
            {columns.map(({ key, label }) => (
              <th
                key={key}
                onClick={() => onSort(key)}
                className="text-left px-3 py-2 font-medium text-muted-foreground text-[10px] uppercase tracking-wide cursor-pointer select-none whitespace-nowrap"
              >
                <span className="inline-flex items-center gap-1">
                  {label}
                  <SortIcon active={sortKey === key} dir={sortDir} />
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                {Array.from({ length: 8 }).map((_, j) => (
                  <td key={j} className="px-3 py-3">
                    <div className="h-3 bg-muted/40 rounded w-full" />
                  </td>
                ))}
              </tr>
            ))
          ) : clients.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground text-sm">
                No records match your filters.
              </td>
            </tr>
          ) : (
            clients.map((c) => (
              <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-3 py-2 font-medium whitespace-nowrap">{c.projectName}</td>
                <td className="px-3 py-2 whitespace-nowrap">{c.clientName}</td>
                <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{c.projectType}</td>
                <td className="px-3 py-2 tabular-nums whitespace-nowrap font-semibold">
                  ₱{c.rateAmount.toLocaleString()}
                </td>
                <td className="px-3 py-2 text-center">{c.revisionCount}</td>
                <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">
                  {new Date(c.dateNegotiated).toLocaleDateString("en-PH", {
                    year: "numeric", month: "short", day: "numeric",
                  })}
                </td>
                <td className="px-3 py-2">
                  <span className={`px-1.5 py-0.5 text-[10px] font-medium ${designBadge[c.designStatus]}`}>
                    {c.designStatus}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className={`px-1.5 py-0.5 text-[10px] font-medium ${payBadge[c.paymentStatus]}`}>
                    {c.paymentStatus}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}