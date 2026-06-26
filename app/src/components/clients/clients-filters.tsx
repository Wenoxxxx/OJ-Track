import type { FilterDesign, FilterPayment } from "./types";

interface ClientsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  filterDesign: FilterDesign;
  onFilterDesignChange: (value: FilterDesign) => void;
  filterPayment: FilterPayment;
  onFilterPaymentChange: (value: FilterPayment) => void;
  loading: boolean;
  filteredCount: number;
  totalCount: number;
}

export function ClientsFilters({
  search,
  onSearchChange,
  filterDesign,
  onFilterDesignChange,
  filterPayment,
  onFilterPaymentChange,
  loading,
  filteredCount,
  totalCount,
}: ClientsFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 sm:items-center">
      <input
        type="text"
        placeholder="Search project, client, type…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring w-full sm:w-64"
      />

      <div className="flex gap-2">
        <select
          value={filterDesign}
          onChange={(e) => onFilterDesignChange(e.target.value as FilterDesign)}
          className="border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring flex-1 sm:flex-none"
        >
          <option value="All">All Design</option>
          <option value="Not Started">Not Started</option>
          <option value="Pending">Pending</option>
          <option value="Done">Done</option>
        </select>

        <select
          value={filterPayment}
          onChange={(e) => onFilterPaymentChange(e.target.value as FilterPayment)}
          className="border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring flex-1 sm:flex-none"
        >
          <option value="All">All Payment</option>
          <option value="Not Paid">Not Paid</option>
          <option value="Partial">Partial</option>
          <option value="Paid">Paid</option>
        </select>
      </div>

      <span className="text-xs text-muted-foreground sm:ml-auto">
        {loading ? "Loading…" : `${filteredCount} of ${totalCount} records`}
      </span>
    </div>
  );
}