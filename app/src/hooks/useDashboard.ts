// src/hooks/useDashboard.ts
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export interface DashboardStats {
  totalClients:  number;
  totalSales:    number;
  notStarted:    number;
  pending:       number;
  done:          number;
  payNotPaid:    number;
  payPartial:    number;
  payPaid:       number;
}

export interface RecentProject {
  id:            string;
  projectName:   string;
  clientName:    string;
  projectType:   string;
  rateAmount:    number;
  designStatus:  string;
  paymentStatus: string;
  dateNegotiated: string;
}

export interface MonthlyActivity {
  month:   string;
  clients: number;
  sales:   number;
}

export function useDashboardStats() {
  const [data,    setData]    = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    api.get<DashboardStats>("/api/dashboard/stats")
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useRecentProjects() {
  const [data,    setData]    = useState<RecentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    api.get<RecentProject[]>("/api/dashboard/recent")
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useMonthlyActivity() {
  const [data,    setData]    = useState<MonthlyActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    api.get<MonthlyActivity[]>("/api/dashboard/activity")
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
