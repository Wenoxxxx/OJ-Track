// src/pages/profile.tsx
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileHeaderSkeleton } from "@/components/profile/profile-header-skeleton";
import { useProfile } from "@/hooks/useProfile";

export default function ProfilePage() {
  const { data: profile, loading, error } = useProfile();

  return (
    <>
      <DashboardHeader title="Profile" />
      <main className="p-4 sm:p-6 sm:pr-10 space-y-6">
        {loading && <ProfileHeaderSkeleton />}

        {!loading && error && (
          <p className="text-sm text-rose-500">Failed to load profile: {error}</p>
        )}

        {!loading && !error && profile && <ProfileHeader profile={profile} />}
      </main>
    </>
  );
}