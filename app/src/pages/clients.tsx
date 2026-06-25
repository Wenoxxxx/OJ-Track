// src/pages/clients.tsx
import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { useClients } from "@/hooks/useClients";
import type { Client, DesignStatus, PaymentStatus } from "@/data/store";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

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

type SortKey = keyof Client;
type SortDir = "asc" | "desc";

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ChevronsUpDown size={13} className="text-muted-foreground/50" />;
  return dir === "asc"
    ? <ChevronUp   size={13} className="text-foreground" />
    : <ChevronDown size={13} className="text-foreground" />;
}

const columns: { key: SortKey; label: string }[] = [
  { key: "projectName",   label: "Project Name" },
  { key: "clientName",    label: "Client"        },
  { key: "projectType",   label: "Type"          },
  { key: "rateAmount",    label: "Rate"          },
  { key: "revisionCount", label: "Revisions"     },
  { key: "dateNegotiated",label: "Date"          },
  { key: "designStatus",  label: "Design Status" },
  { key: "paymentStatus", label: "Payment"       },
];

type FilterDesign  = "All" | DesignStatus;
type FilterPayment = "All" | PaymentStatus;

export default function ClientsPage() {
  const { data: clients, loading, error } = useClients();

  const [sortKey,      setSortKey]      = useState<SortKey>("dateNegotiated");
  const [sortDir,      setSortDir]      = useState<SortDir>("desc");
  const [filterDesign, setFilterDesign] = useState<FilterDesign>("All");
  const [filterPayment,setFilterPayment]= useState<FilterPayment>("All");
  const [search,       setSearch]       = useState("");

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const filtered = clients
    .filter((c) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        c.projectName.toLowerCase().includes(q) ||
        c.clientName.toLowerCase().includes(q) ||
        c.projectType.toLowerCase().includes(q);
      const matchDesign  = filterDesign  === "All" || c.designStatus  === filterDesign;
      const matchPayment = filterPayment === "All" || c.paymentStatus === filterPayment;
      return matchSearch && matchDesign && matchPayment;
    })
    .sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === bv) return 0;
      const cmp = av < bv ? -1 : 1;
      return sortDir === "asc" ? cmp : -cmp;
    });

  return (
    <>
      <DashboardHeader title="Clients" />

      <main className="p-4 sm:p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 sm:items-center">
          <input
            type="text"
            placeholder="Search project, client, type…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring w-full sm:w-64"
          />

          <div className="flex gap-2">
            <select
              value={filterDesign}
              onChange={(e) => setFilterDesign(e.target.value as FilterDesign)}
              className="border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring flex-1 sm:flex-none"
            >
              <option value="All">All Design</option>
              <option value="Not Started">Not Started</option>
              <option value="Pending">Pending</option>
              <option value="Done">Done</option>
            </select>

            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value as FilterPayment)}
              className="border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring flex-1 sm:flex-none"
            >
              <option value="All">All Payment</option>
              <option value="Not Paid">Not Paid</option>
              <option value="Partial">Partial</option>
              <option value="Paid">Paid</option>
            </select>
          </div>

          <span className="text-xs text-muted-foreground sm:ml-auto">
            {loading ? "Loading…" : `${filtered.length} of ${clients.length} records`}
          </span>
        </div>

        {/* Error */}
        {error && (
          <div className="border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 rounded">
            Failed to load projects: {error}
          </div>
        )}

        {/* Table */}
        <div className="border bg-card overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b bg-muted/40">
              <tr>
                {columns.map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
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
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground text-sm">
                    No records match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
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
      </main>
    </>
  );
}
