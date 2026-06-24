// src/hooks/useProfile.ts
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export interface UserProfile {
  id:         string;
  fullName:   string;
  initials:   string;
  profession: string;
  email:      string;
  avatarUrl:  string | null;
  createdAt:  string;
}

export function useProfile() {
  const [data,    setData]    = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    api.get<UserProfile>("/api/profile")
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
