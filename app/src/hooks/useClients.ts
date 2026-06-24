// src/hooks/useClients.ts
import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import type { Client } from "@/data/store";

export function useClients() {
  const [data,    setData]    = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const fetchClients = useCallback(() => {
    setLoading(true);
    setError(null);
    api.get<Client[]>("/api/projects")
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  return { data, loading, error, refetch: fetchClients };
}
