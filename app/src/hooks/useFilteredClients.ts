import { useMemo } from "react";
import type { Client } from "@/data/store";
import type { SortKey, SortDir, FilterDesign, FilterPayment } from "@/components/clients/types";

interface UseFilteredClientsParams {
  clients: Client[];
  search: string;
  filterDesign: FilterDesign;
  filterPayment: FilterPayment;
  sortKey: SortKey;
  sortDir: SortDir;
}

export function useFilteredClients({
  clients,
  search,
  filterDesign,
  filterPayment,
  sortKey,
  sortDir,
}: UseFilteredClientsParams): Client[] {
  return useMemo(() => {
    const q = search.toLowerCase();

    return clients
      .filter((c) => {
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
  }, [clients, search, filterDesign, filterPayment, sortKey, sortDir]);
}