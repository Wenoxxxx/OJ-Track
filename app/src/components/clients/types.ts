import type { Client, DesignStatus, PaymentStatus } from "@/data/store";

export type SortKey = keyof Client;
export type SortDir = "asc" | "desc";
export type FilterDesign = "All" | DesignStatus;
export type FilterPayment = "All" | PaymentStatus;