import { useState } from "react";
import { Palette, CreditCard, CalendarDays, Tag, RotateCcw, Archive, Trash2, RotateCw, AlertTriangle } from "lucide-react";
import type { Client, DesignStatus, PaymentStatus } from "@/data/store";

// ── Status cycle order ──────────────────────────────────────
const designCycle: DesignStatus[] = ["Not Started", "Pending", "Done"];
const payCycle:    PaymentStatus[] = ["Not Paid", "Partial", "Paid"];

function nextDesign(s: DesignStatus): DesignStatus {
  return designCycle[(designCycle.indexOf(s) + 1) % designCycle.length];
}
function nextPay(s: PaymentStatus): PaymentStatus {
  return payCycle[(payCycle.indexOf(s) + 1) % payCycle.length];
}

// ── Badge colour maps ───────────────────────────────────────
const designStyles: Record<DesignStatus, { bg: string; text: string; dot: string }> = {
  "Not Started": { bg: "bg-rose-50   border border-rose-200",    text: "text-rose-600",    dot: "bg-rose-400"    },
  Pending:       { bg: "bg-amber-50  border border-amber-200",   text: "text-amber-700",   dot: "bg-amber-400"   },
  Done:          { bg: "bg-emerald-50 border border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500" },
};
const payStyles: Record<PaymentStatus, { bg: string; text: string; dot: string }> = {
  "Not Paid": { bg: "bg-rose-50   border border-rose-200",   text: "text-rose-600",  dot: "bg-rose-400"  },
  Partial:    { bg: "bg-amber-50  border border-amber-200",  text: "text-amber-700", dot: "bg-amber-400" },
  Paid:       { bg: "bg-teal-50   border border-teal-200",   text: "text-teal-700",  dot: "bg-teal-500"  },
};

// ── Subcomponent: status cycle button ──────────────────────
interface CycleButtonProps<T extends string> {
  icon: React.ReactNode;
  label: string;
  value: T;
  styles: { bg: string; text: string; dot: string };
  disabled: boolean;
  onClick: () => void;
}
function CycleButton<T extends string>({ icon, label, value, styles, disabled, onClick }: CycleButtonProps<T>) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={`Click to advance ${label}`}
      className={`
        group flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold
        transition-all duration-150 select-none w-full justify-center
        ${styles.bg} ${styles.text}
        hover:brightness-95 active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${styles.dot}`} />
      {icon}
      <span>{value}</span>
    </button>
  );
}

// ── Card skeleton ───────────────────────────────────────────
function CardSkeleton() {
  return (
    <div className="border bg-card p-4 space-y-3 animate-pulse">
      <div className="h-4 bg-muted/60 w-2/3" />
      <div className="h-3 bg-muted/40 w-1/2" />
      <div className="grid grid-cols-2 gap-2 pt-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-3 bg-muted/40 w-full" />
        ))}
      </div>
      <div className="flex gap-2 pt-2">
        <div className="h-7 bg-muted/40 flex-1" />
        <div className="h-7 bg-muted/40 flex-1" />
      </div>
    </div>
  );
}

// ── Active card ─────────────────────────────────────────────
interface ActiveCardProps {
  c: Client;
  isBusy: boolean;
  onUpdateDesign:  (id: string, status: DesignStatus)  => void;
  onUpdatePayment: (id: string, status: PaymentStatus) => void;
  onArchive: (id: string) => void;
}
function ActiveCard({ c, isBusy, onUpdateDesign, onUpdatePayment, onArchive }: ActiveCardProps) {
  const [confirmArchive, setConfirmArchive] = useState(false);
  const ds = designStyles[c.designStatus];
  const ps = payStyles[c.paymentStatus];

  return (
    <article
      className={`
        border bg-card flex flex-col gap-0 relative
        transition-shadow duration-200 hover:shadow-md
        ${isBusy ? "opacity-60 pointer-events-none" : ""}
      `}
    >
      {/* ── Archive button (top-right corner) ── */}
      {!confirmArchive ? (
        <button
          onClick={() => setConfirmArchive(true)}
          title="Archive project"
          className="absolute top-2 right-2 p-1 text-muted-foreground/40 hover:text-amber-500 hover:bg-amber-50 transition-colors"
        >
          <Archive size={13} />
        </button>
      ) : (
        <div className="absolute top-1.5 right-1.5 flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-1 z-10 shadow-sm">
          <AlertTriangle size={11} className="text-amber-600 flex-shrink-0" />
          <span className="text-[10px] text-amber-700 font-semibold">Archive?</span>
          <button
            onClick={() => { onArchive(c.id); setConfirmArchive(false); }}
            className="text-[10px] font-bold text-amber-700 hover:text-amber-900 underline ml-1"
          >
            Yes
          </button>
          <button
            onClick={() => setConfirmArchive(false)}
            className="text-[10px] text-muted-foreground hover:text-foreground underline"
          >
            No
          </button>
        </div>
      )}

      {/* ── Header ── */}
      <div className="px-4 pt-4 pb-3 border-b pr-8">
        <p className="font-semibold text-sm leading-tight line-clamp-1" title={c.projectName}>
          {c.projectName}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
          {c.clientName}
        </p>
      </div>

      {/* ── Meta grid ── */}
      <div className="px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs flex-1">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Tag size={11} className="flex-shrink-0" />
          <span className="truncate">{c.projectType}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <CalendarDays size={11} className="flex-shrink-0" />
          <span>
            {new Date(c.dateNegotiated).toLocaleDateString("en-PH", {
              month: "short", day: "numeric", year: "numeric",
            })}
          </span>
        </div>
        <div className="font-semibold tabular-nums text-foreground">
          ₱{c.rateAmount.toLocaleString()}
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <RotateCcw size={11} className="flex-shrink-0" />
          <span>{c.revisionCount} rev{c.revisionCount !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* ── Status buttons ── */}
      <div className="border-t grid grid-cols-2 divide-x">
        <CycleButton<DesignStatus>
          icon={<Palette size={11} />}
          label="design status"
          value={c.designStatus}
          styles={ds}
          disabled={isBusy}
          onClick={() => onUpdateDesign(c.id, nextDesign(c.designStatus))}
        />
        <CycleButton<PaymentStatus>
          icon={<CreditCard size={11} />}
          label="payment status"
          value={c.paymentStatus}
          styles={ps}
          disabled={isBusy}
          onClick={() => onUpdatePayment(c.id, nextPay(c.paymentStatus))}
        />
      </div>
    </article>
  );
}

// ── Archived card ───────────────────────────────────────────
interface ArchivedCardProps {
  c: Client;
  isBusy: boolean;
  onRestore: (id: string) => void;
  onDelete:  (id: string) => void;
}
function ArchivedCard({ c, isBusy, onRestore, onDelete }: ArchivedCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <article
      className={`
        border border-dashed border-muted-foreground/30 bg-muted/20 flex flex-col gap-0
        transition-shadow duration-200
        ${isBusy ? "opacity-60 pointer-events-none" : ""}
      `}
    >
      {/* ── Header ── */}
      <div className="px-4 pt-4 pb-3 border-b border-dashed border-muted-foreground/20">
        <p className="font-semibold text-sm leading-tight line-clamp-1 text-muted-foreground" title={c.projectName}>
          {c.projectName}
        </p>
        <p className="text-xs text-muted-foreground/70 mt-0.5 line-clamp-1">
          {c.clientName}
        </p>
      </div>

      {/* ── Meta grid ── */}
      <div className="px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs flex-1">
        <div className="flex items-center gap-1.5 text-muted-foreground/60">
          <Tag size={11} className="flex-shrink-0" />
          <span className="truncate">{c.projectType}</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground/60">
          <CalendarDays size={11} className="flex-shrink-0" />
          <span>
            {new Date(c.dateNegotiated).toLocaleDateString("en-PH", {
              month: "short", day: "numeric", year: "numeric",
            })}
          </span>
        </div>
        <div className="font-semibold tabular-nums text-muted-foreground">
          ₱{c.rateAmount.toLocaleString()}
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground/60">
          <RotateCcw size={11} className="flex-shrink-0" />
          <span>{c.revisionCount} rev{c.revisionCount !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* ── Restore / Delete buttons ── */}
      <div className="border-t border-dashed border-muted-foreground/20">
        {confirmDelete ? (
          <div className="flex items-center justify-center gap-2 px-3 py-2 bg-rose-50 border-t border-rose-200">
            <AlertTriangle size={12} className="text-rose-500 flex-shrink-0" />
            <span className="text-[11px] text-rose-600 font-semibold">Permanently delete?</span>
            <button
              onClick={() => { onDelete(c.id); setConfirmDelete(false); }}
              className="text-[11px] font-bold text-rose-600 hover:text-rose-800 underline"
            >
              Delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-[11px] text-muted-foreground hover:text-foreground underline"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 divide-x divide-muted-foreground/20">
            <button
              onClick={() => onRestore(c.id)}
              disabled={isBusy}
              title="Restore to active"
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCw size={11} />
              Restore
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              disabled={isBusy}
              title="Permanently delete"
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-[11px] font-semibold text-rose-500 hover:bg-rose-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={11} />
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

// ── Main grid component ─────────────────────────────────────
interface ClientsGridProps {
  clients: Client[];
  loading: boolean;
  onUpdateDesign:  (id: string, status: DesignStatus)  => void;
  onUpdatePayment: (id: string, status: PaymentStatus) => void;
  onArchive:  (id: string) => void;
  updatingId: string | null;
  // Archived section
  archived:        Client[];
  archivedLoading: boolean;
  showArchived:    boolean;
  onRestore: (id: string) => void;
  onDelete:  (id: string) => void;
  archivedBusyId: string | null;
}

export function ClientsGrid({
  clients,
  loading,
  onUpdateDesign,
  onUpdatePayment,
  onArchive,
  updatingId,
  archived,
  archivedLoading,
  showArchived,
  onRestore,
  onDelete,
  archivedBusyId,
}: ClientsGridProps) {
  return (
    <div className="space-y-8">

      {/* ── Active grid ── */}
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
        Current Projects ({clients.length})
      </h3>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
          <p className="text-sm">No records match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {clients.map((c) => (
            <ActiveCard
              key={c.id}
              c={c}
              isBusy={updatingId === c.id}
              onUpdateDesign={onUpdateDesign}
              onUpdatePayment={onUpdatePayment}
              onArchive={onArchive}
            />
          ))}
        </div>
      )}

      {/* ── Archived section ── */}
      {showArchived && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Archive size={13} className="text-muted-foreground" />
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Archived ({archived.length})
            </h3>
          </div>
          {archivedLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : archived.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No archived projects.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {archived.map((c) => (
                <ArchivedCard
                  key={c.id}
                  c={c}
                  isBusy={archivedBusyId === c.id}
                  onRestore={onRestore}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
