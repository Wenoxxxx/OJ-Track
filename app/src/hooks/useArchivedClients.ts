// src/hooks/useArchivedClients.ts
import {useState, useCallback } from "react";
import { api } from "@/lib/api";
import type { Client } from "@/data/store";

export function useArchivedClients() {
  const [data,    setData]    = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);   // lazy — only loads when opened
  const [error,   setError]   = useState<string | null>(null);

  const fetchArchived = useCallback(() => {
    setLoading(true);
    setError(null);
    api.get<Client[]>("/api/projects/archived")
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error, refetch: fetchArchived };
}
