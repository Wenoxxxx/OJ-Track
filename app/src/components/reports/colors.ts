import type { DesignStatus, PaymentStatus } from "@/data/store";

export const designColors: Record<DesignStatus, string> = {
  "Not Started": "#f43f5e",
  Pending:       "#f59e0b",
  Done:          "#10b981",
};

export const payColors: Record<PaymentStatus, string> = {
  "Not Paid": "#f43f5e",
  Partial:    "#f59e0b",
  Paid:       "#14b8a6",
};