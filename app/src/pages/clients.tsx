import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ClientsFilters } from "@/components/clients/clients-filters";
import { ClientsTable } from "@/components/clients/clients-table";
import { useClients } from "@/hooks/useClients";
import type { SortKey, SortDir, FilterDesign, FilterPayment } from "@/components/clients/types";

export default function ClientsPage() {
  const { data: clients, loading, error } = useClients();

  const [sortKey, setSortKey] = useState<SortKey>("dateNegotiated");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filterDesign, setFilterDesign] = useState<FilterDesign>("All");
  const [filterPayment, setFilterPayment] = useState<FilterPayment>("All");
  const [search, setSearch] = useState("");

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
      const matchDesign = filterDesign === "All" || c.designStatus === filterDesign;
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
        <ClientsFilters
          search={search}
          onSearchChange={setSearch}
          filterDesign={filterDesign}
          onFilterDesignChange={setFilterDesign}
          filterPayment={filterPayment}
          onFilterPaymentChange={setFilterPayment}
          loading={loading}
          filteredCount={filtered.length}
          totalCount={clients.length}
        />

        {error && (
          <div className="border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 rounded">
            Failed to load projects: {error}
          </div>
        )}

        <ClientsTable
          clients={filtered}
          loading={loading}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
        />
      </main>
    </>
  );
}