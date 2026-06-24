// src/pages/profile.tsx
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { useProfile } from "@/hooks/useProfile";

export default function ProfilePage() {
  const { data: profile, loading, error } = useProfile();

  return (
    <>
      <DashboardHeader title="Profile" />
      <main className="p-6 pr-10 space-y-6">
        {loading && (
          <div className="flex items-center gap-4 animate-pulse">
            <div className="h-16 w-16 rounded-full bg-muted/40" />
            <div className="space-y-2">
              <div className="h-5 w-48 bg-muted/40 rounded" />
              <div className="h-3 w-28 bg-muted/40 rounded" />
            </div>
          </div>
        )}

        {!loading && error && (
          <p className="text-sm text-rose-500">Failed to load profile: {error}</p>
        )}

        {!loading && !error && profile && (
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              {profile.avatarUrl
                ? <img src={profile.avatarUrl} alt={profile.fullName} className="h-full w-full object-cover rounded-full" />
                : <AvatarFallback className="text-sm">{profile.initials || "OJ"}</AvatarFallback>
              }
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-primary">
                {profile.fullName}
              </h1>
              <p className="text-sm text-muted-foreground">{profile.profession}</p>
              <p className="text-xs text-muted-foreground/70 mt-0.5">{profile.email}</p>
            </div>
          </div>
        )}
      </main>
    </>
  );
}