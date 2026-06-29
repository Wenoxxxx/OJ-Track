// src/data/store.ts
// Shared TypeScript types for OJ-Track.
// Static mock data has been removed — all data now comes from the MySQL API.

export type DesignStatus  = "Not Started" | "Pending" | "Done";
export type PaymentStatus = "Not Paid" | "Partial" | "Paid";
export type ProjectType   = "Logo" | "UI/UX" | "Branding" | "Print" | "Web" | "Illustration";

export interface Client {
  id:             string;
  projectName:    string;
  clientName:     string;
  projectType:    ProjectType;
  rateAmount:     number;
  revisionCount:  number;
  dateNegotiated: string; // ISO date string YYYY-MM-DD
  designStatus:   DesignStatus;
  paymentStatus:  PaymentStatus;
  isArchived:     boolean;
}
