// src/hooks/useReports.ts
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { DesignStatus, PaymentStatus } from "@/data/store";

export interface ReportStats {
  totalClients:   number;
  totalSales:     number;
  totalRevisions: number;
  notStarted:     number;
  pending:        number;
  done:           number;
  payNotPaid:     number;
  payPartial:     number;
  payPaid:        number;
}

export interface MonthlySales {
  month:   string;
  clients: number;
  sales:   number;
}

export interface SalesByType {
  type:  string;
  sales: number;
}

export function useReportStats() {
  const [data,    setData]    = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    api.get<ReportStats>("/api/reports/stats")
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useMonthlySales() {
  const [data,    setData]    = useState<MonthlySales[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    api.get<MonthlySales[]>("/api/reports/monthly")
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useSalesByType() {
  const [data,    setData]    = useState<SalesByType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    api.get<SalesByType[]>("/api/reports/by-type")
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

// Re-export status types so reports.tsx can keep using them
export type { DesignStatus, PaymentStatus };
