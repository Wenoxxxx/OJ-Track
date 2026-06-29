import { useState, useCallback } from "react";
import { Plus, Archive } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ClientsFilters } from "@/components/clients/clients-filters";
import { ClientsGrid } from "@/components/clients/clients-grid";
import { CreateProjectModal } from "@/components/clients/create-project-modal";
import { useClients } from "@/hooks/useClients";
import { useArchivedClients } from "@/hooks/useArchivedClients";
import { api } from "@/lib/api";
import type { Client, DesignStatus, PaymentStatus } from "@/data/store";
import type { SortKey, SortDir, FilterDesign, FilterPayment } from "@/components/clients/types";

export default function ClientsPage() {
  const { data: clients, loading, error, refetch }          = useClients();
  const { data: archived, loading: archivedLoading,
          error: archivedError, refetch: refetchArchived }  = useArchivedClients();

  // ── UI state ──────────────────────────────────────────────
  const [sortKey,       setSortKey]       = useState<SortKey>("dateNegotiated");
  const [sortDir,       setSortDir]       = useState<SortDir>("desc");
  const [filterDesign,  setFilterDesign]  = useState<FilterDesign>("All");
  const [filterPayment, setFilterPayment] = useState<FilterPayment>("All");
  const [search,        setSearch]        = useState("");
  const [updatingId,    setUpdatingId]    = useState<string | null>(null);
  const [archivedBusyId, setArchivedBusyId] = useState<string | null>(null);
  const [showCreate,    setShowCreate]    = useState(false);
  const [showArchived,  setShowArchived]  = useState(false);

  // ── Sort ──────────────────────────────────────────────────
  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  // ── Archive panel toggle ──────────────────────────────────
  function toggleArchived() {
    if (!showArchived) {
      refetchArchived(); // lazy load
    }
    setShowArchived((v) => !v);
  }

  // ── Status updates ────────────────────────────────────────
  const handleUpdateDesign = useCallback(async (id: string, status: DesignStatus) => {
    setUpdatingId(id);
    try {
      await api.patch<{ success: boolean }>(`/api/projects/${id}/status`, { designStatus: status });
      refetch();
    } finally {
      setUpdatingId(null);
    }
  }, [refetch]);

  const handleUpdatePayment = useCallback(async (id: string, status: PaymentStatus) => {
    setUpdatingId(id);
    try {
      await api.patch<{ success: boolean }>(`/api/projects/${id}/status`, { paymentStatus: status });
      refetch();
    } finally {
      setUpdatingId(null);
    }
  }, [refetch]);

  // ── Archive / Restore / Delete ────────────────────────────
  const handleArchive = useCallback(async (id: string) => {
    setUpdatingId(id);
    try {
      await api.patch<{ success: boolean }>(`/api/projects/${id}/archive`, {});
      refetch();
      if (showArchived) refetchArchived();
    } finally {
      setUpdatingId(null);
    }
  }, [refetch, refetchArchived, showArchived]);

  const handleRestore = useCallback(async (id: string) => {
    setArchivedBusyId(id);
    try {
      await api.patch<{ success: boolean }>(`/api/projects/${id}/unarchive`, {});
      refetch();
      refetchArchived();
    } finally {
      setArchivedBusyId(null);
    }
  }, [refetch, refetchArchived]);

  const handleDelete = useCallback(async (id: string) => {
    setArchivedBusyId(id);
    try {
      await api.delete<{ success: boolean }>(`/api/projects/${id}`);
      refetchArchived();
    } finally {
      setArchivedBusyId(null);
    }
  }, [refetchArchived]);

  // ── Create ────────────────────────────────────────────────
  const handleCreated = useCallback((_client: Client) => {
    refetch();
  }, [refetch]);

  // ── Filtered + sorted list ────────────────────────────────
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

        {/* ── Toolbar row ── */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
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

          {/* Action buttons — pushed to the right on sm+ */}
          <div className="flex gap-2 sm:ml-auto flex-shrink-0">
            <button
              onClick={toggleArchived}
              className={`
                flex items-center gap-1.5 px-3 py-2 text-xs border font-medium transition-colors
                ${showArchived
                  ? "bg-muted text-foreground border-foreground/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"}
              `}
            >
              <Archive size={13} />
              {showArchived ? "Hide Archived" : "Show Archived"}
              {!showArchived && archived.length > 0 && (
                <span className="ml-1 bg-muted text-muted-foreground text-[10px] px-1.5 py-0.5 font-bold">
                  {archived.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus size={13} />
              New Project
            </button>
          </div>
        </div>

        {/* ── Error banners ── */}
        {error && (
          <div className="border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-600">
            Failed to load projects: {error}
          </div>
        )}
        {archivedError && showArchived && (
          <div className="border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-600">
            Failed to load archived projects: {archivedError}
          </div>
        )}

        {/* ── Cards grid ── */}
        <ClientsGrid
          clients={filtered}
          loading={loading}
          onUpdateDesign={handleUpdateDesign}
          onUpdatePayment={handleUpdatePayment}
          onArchive={handleArchive}
          updatingId={updatingId}
          archived={archived}
          archivedLoading={archivedLoading}
          showArchived={showArchived}
          onRestore={handleRestore}
          onDelete={handleDelete}
          archivedBusyId={archivedBusyId}
        />
      </main>

      {/* ── Create modal ── */}
      <CreateProjectModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handleCreated}
      />
    </>
  );
}