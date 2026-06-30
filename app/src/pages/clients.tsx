import { useState, useCallback } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ClientsFilters } from "@/components/clients/clients-filters";
import { ClientsGrid } from "@/components/clients/clients-grid";
import { ClientsToolbarActions } from "@/components/clients/clients-toolbar-actions";
import { ClientsErrorBanner } from "@/components/clients/clients-error-banner";
import { CreateProjectModal } from "@/components/clients/create-project-modal";
import { useClients } from "@/hooks/useClients";
import { useArchivedClients } from "@/hooks/useArchivedClients";
import { useFilteredClients } from "@/hooks/useFilteredClients";
import { api } from "@/lib/api";
import type { DesignStatus, PaymentStatus } from "@/data/store";
import type { SortKey, SortDir, FilterDesign, FilterPayment } from "@/components/clients/types";

export default function ClientsPage() {
  const { data: clients, loading, error, refetch }          = useClients();
  const { data: archived, loading: archivedLoading,
          error: archivedError, refetch: refetchArchived }  = useArchivedClients();

  // ── UI state ──────────────────────────────────────────────
  const sortKey: SortKey = "dateNegotiated";
  const sortDir: SortDir = "desc";
  const [filterDesign,  setFilterDesign]  = useState<FilterDesign>("All");
  const [filterPayment, setFilterPayment] = useState<FilterPayment>("All");
  const [search,        setSearch]        = useState("");
  const [updatingId,    setUpdatingId]    = useState<string | null>(null);
  const [archivedBusyId, setArchivedBusyId] = useState<string | null>(null);
  const [showCreate,    setShowCreate]    = useState(false);
  const [showArchived,  setShowArchived]  = useState(false);

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
  const handleCreated = useCallback(() => {
    refetch();
  }, [refetch]);

  // ── Filtered + sorted list ────────────────────────────────
  const filtered = useFilteredClients({
    clients,
    search,
    filterDesign,
    filterPayment,
    sortKey,
    sortDir,
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

          <ClientsToolbarActions
            showArchived={showArchived}
            archivedCount={archived.length}
            onToggleArchived={toggleArchived}
            onNewProject={() => setShowCreate(true)}
          />
        </div>

        {/* ── Error banners ── */}
        {error && (
          <ClientsErrorBanner message={`Failed to load projects: ${error}`} />
        )}
        {archivedError && showArchived && (
          <ClientsErrorBanner message={`Failed to load archived projects: ${archivedError}`} />
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