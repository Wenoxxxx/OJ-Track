import { useState, useEffect, useRef } from "react";
import { X, Plus } from "lucide-react";
import { api } from "@/lib/api";
import type { Client, DesignStatus, PaymentStatus, ProjectType } from "@/data/store";

// ── Field options ────────────────────────────────────────────
const PROJECT_TYPES: ProjectType[] = ["Logo", "UI/UX", "Branding", "Print", "Web", "Illustration"];
const DESIGN_STATUSES: DesignStatus[] = ["Not Started", "Pending", "Done"];
const PAYMENT_STATUSES: PaymentStatus[] = ["Not Paid", "Partial", "Paid"];

// ── Form defaults ────────────────────────────────────────────
function defaultForm() {
  return {
    projectName:    "",
    clientName:     "",
    projectType:    "Logo" as ProjectType,
    rateAmount:     "",
    revisionCount:  "0",
    dateNegotiated: new Date().toISOString().split("T")[0],
    designStatus:   "Not Started" as DesignStatus,
    paymentStatus:  "Not Paid" as PaymentStatus,
  };
}

type FormState = ReturnType<typeof defaultForm>;
type FormErrors = Partial<Record<keyof FormState, string>>;

function validate(f: FormState): FormErrors {
  const errs: FormErrors = {};
  if (!f.projectName.trim())  errs.projectName  = "Project name is required.";
  if (!f.clientName.trim())   errs.clientName   = "Client name is required.";
  if (!f.dateNegotiated)      errs.dateNegotiated = "Date is required.";
  const rate = Number(f.rateAmount);
  if (!f.rateAmount || isNaN(rate) || rate < 0) errs.rateAmount = "Enter a valid rate (≥ 0).";
  const rev = Number(f.revisionCount);
  if (isNaN(rev) || rev < 0) errs.revisionCount = "Revisions must be ≥ 0.";
  return errs;
}

// ── Label + input wrapper ─────────────────────────────────────
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      {children}
      {error && <p className="text-[11px] text-rose-500">{error}</p>}
    </div>
  );
}

const inputClass =
  "border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring w-full";

// ── Props ─────────────────────────────────────────────────────
interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (client: Client) => void;
}

export function CreateProjectModal({ open, onClose, onCreated }: CreateProjectModalProps) {
  const [form,      setForm]      = useState<FormState>(defaultForm());
  const [errors,    setErrors]    = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError,  setApiError]  = useState<string | null>(null);
  const firstRef = useRef<HTMLInputElement>(null);

  // Reset when opened
  useEffect(() => {
    if (open) {
      setForm(defaultForm());
      setErrors({});
      setApiError(null);
      setTimeout(() => firstRef.current?.focus(), 50);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    setApiError(null);
    try {
      const created = await api.post<Client>("/api/projects", {
        projectName:    form.projectName.trim(),
        clientName:     form.clientName.trim(),
        projectType:    form.projectType,
        rateAmount:     Number(form.rateAmount),
        revisionCount:  Number(form.revisionCount),
        dateNegotiated: form.dateNegotiated,
        designStatus:   form.designStatus,
        paymentStatus:  form.paymentStatus,
      });
      onCreated(created);
      onClose();
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel — slides in from the right */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Create new project"
        className="fixed right-0 top-0 z-[201] h-full w-full max-w-md bg-card border-l shadow-2xl flex flex-col"
        style={{ animation: "slideInRight 0.22s ease" }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2">
            <Plus size={16} className="text-primary" />
            <h2 className="font-bold text-sm">New Project</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Form body ── */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

          <Field label="Project Name" error={errors.projectName}>
            <input
              ref={firstRef}
              type="text"
              value={form.projectName}
              onChange={(e) => set("projectName", e.target.value)}
              placeholder="e.g. Brand Identity Refresh"
              className={inputClass}
            />
          </Field>

          <Field label="Client Name" error={errors.clientName}>
            <input
              type="text"
              value={form.clientName}
              onChange={(e) => set("clientName", e.target.value)}
              placeholder="e.g. Juan dela Cruz"
              className={inputClass}
            />
          </Field>

          <Field label="Project Type" error={errors.projectType}>
            <select
              value={form.projectType}
              onChange={(e) => set("projectType", e.target.value as ProjectType)}
              className={inputClass}
            >
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Rate (₱)" error={errors.rateAmount}>
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.rateAmount}
                onChange={(e) => set("rateAmount", e.target.value)}
                placeholder="0"
                className={inputClass}
              />
            </Field>
            <Field label="Revisions" error={errors.revisionCount}>
              <input
                type="number"
                min={0}
                step={1}
                value={form.revisionCount}
                onChange={(e) => set("revisionCount", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Date Negotiated" error={errors.dateNegotiated}>
            <input
              type="date"
              value={form.dateNegotiated}
              onChange={(e) => set("dateNegotiated", e.target.value)}
              className={inputClass}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Design Status" error={errors.designStatus}>
              <select
                value={form.designStatus}
                onChange={(e) => set("designStatus", e.target.value as DesignStatus)}
                className={inputClass}
              >
                {DESIGN_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Payment Status" error={errors.paymentStatus}>
              <select
                value={form.paymentStatus}
                onChange={(e) => set("paymentStatus", e.target.value as PaymentStatus)}
                className={inputClass}
              >
                {PAYMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          {apiError && (
            <div className="border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-600">
              {apiError}
            </div>
          )}
        </form>

        {/* ── Footer ── */}
        <div className="border-t px-5 py-4 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 text-sm border hover:bg-muted transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-project-form"
            disabled={submitting}
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? (
              <>
                <span className="inline-block w-3 h-3 border-2 border-white/40 border-t-white animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Plus size={13} />
                Create Project
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Slide-in animation keyframe */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
}
